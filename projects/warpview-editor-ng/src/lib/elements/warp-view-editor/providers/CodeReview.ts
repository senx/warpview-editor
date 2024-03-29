/*
 *  Copyright 2020 SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import * as monacoEditor from 'monaco-editor';
import {
  CodeSelection,
  commentReducer,
  CommentState as ReviewCommentStore,
  reduceComments,
  ReviewComment,
  ReviewCommentEvent,
  ReviewCommentRenderState,
  ReviewCommentState,
  ReviewCommentStatus,
} from './events-comments-reducers';
import * as uuid from 'uuid';

export {ReviewCommentStore, ReviewCommentEvent, reduceComments};

interface MonacoWindow {
  monaco: any;
}

const monacoWindow = (window as any) as MonacoWindow;

enum NavigationDirection {
  next = 1,
  prev = 2,
}

export enum EditorMode {
  insertComment = 1,
  editComment = 2,
  toolbar = 3,
}

export function createReviewManager(
  editor: any,
  currentUser: string,
  actions?: ReviewCommentEvent[],
  onChange?: OnActionsChanged,
  config?: ReviewManagerConfig,
  verbose?: boolean
): ReviewManager {
  //For Debug: (window as any).editor = editor;
  const rm = new ReviewManager(editor, currentUser, onChange, config, verbose);
  rm.load(actions || []);
  return rm;
}

interface ReviewCommentIterItem {
  depth: number;
  state: ReviewCommentState;
}

interface OnActionsChanged {
  (actions: ReviewCommentEvent[]): void;
}

export interface ReviewManagerConfig {
  commentIndent?: number;
  commentIndentOffset?: number;
  editButtonEnableRemove?: boolean;
  editButtonOffset?: string;
  formatDate?: { (dt: Date): string };
  readOnly?: boolean;
  reviewCommentIconActive?: string;
  reviewCommentIconSelect?: string;
  showInRuler?: boolean;
  verticalOffset?: number;
  cancelButton?: {
    label: string,
    class: string
  };
  addButton?: {
    label: string,
    class: string
  };
  replyButton?: {
    label: string,
    class: string
  };
  removeButton?: {
    label: string,
    class: string
  };
  editButton?: {
    label: string,
    class: string
  };
}

interface ReviewManagerConfigPrivate {
  commentIndent: number;
  commentIndentOffset: number;
  editButtonEditText: string;
  editButtonEnableEdit: boolean;
  editButtonEnableRemove: boolean;
  editButtonOffset: string;
  formatDate?: { (dt: Date | string): string };
  readOnly: boolean;
  rulerMarkerColor: any;
  rulerMarkerDarkColor: any;
  showAddCommentGlyph: boolean;
  showInRuler: boolean;
  verticalOffset: number;
  cancelButton?: {
    label: string,
    class: string
  };
  addButton?: {
    label: string,
    class: string
  };
  replyButton?: {
    label: string,
    class: string
  };
  removeButton?: {
    label: string,
    class: string
  };
  editButton?: {
    label: string,
    class: string
  };
}

const defaultReviewManagerConfig: ReviewManagerConfigPrivate = {
  commentIndent: 20,
  commentIndentOffset: 20,
  editButtonEditText: 'Edit',
  editButtonEnableEdit: true,
  editButtonEnableRemove: true,
  editButtonOffset: '-10px',
  formatDate: null,
  readOnly: false,
  rulerMarkerColor: 'darkorange',
  rulerMarkerDarkColor: 'darkorange',
  showAddCommentGlyph: true,
  showInRuler: true,
  verticalOffset: 0,
  cancelButton: {
    label: 'Cancel',
    class: ''
  },
  addButton: {
    label: 'Add comment',
    class: ''
  },
  replyButton: {
    label: 'Reply',
    class: ''
  },
  removeButton: {
    label: 'Remove',
    class: ''
  },
  editButton: {
    label: 'Edit',
    class: ''
  }
};

const CONTROL_ATTR_NAME = 'ReviewManagerControl';
const POSITION_BELOW = 2; //above=1, below=2, exact=0
const POSITION_EXACT = 0;

interface EditorElements {
  cancel: HTMLButtonElement;
  confirm: HTMLButtonElement;
  root: HTMLSpanElement;
  textarea: HTMLTextAreaElement;
}

interface InlineToolbarElements {
  add: HTMLSpanElement;
  edit: HTMLSpanElement;
  remove: HTMLSpanElement;
  root: HTMLDivElement;
}

interface RenderStoreItem {
  viewZoneId: string;
  renderStatus: ReviewCommentRenderState;
}

export class ReviewManager {
  currentUser: string;
  editor: monacoEditor.editor.IStandaloneCodeEditor;
  editorConfig: monacoEditor.editor.IEditorOptions;
  events: ReviewCommentEvent[];
  store: ReviewCommentStore;
  activeComment?: ReviewComment;
  widgetInlineToolbar: monacoEditor.editor.IContentWidget;
  widgetInlineCommentEditor: monacoEditor.editor.IContentWidget;
  onChange: OnActionsChanged;
  editorMode: EditorMode;
  config: ReviewManagerConfigPrivate;
  currentLineDecorations: string[];
  currentCommentDecorations: string[];
  currentLineDecorationLineNumber?: number;

  editorElements: EditorElements;
  inlineToolbarElements: InlineToolbarElements;
  verbose: boolean;
  canAddCondition: monacoEditor.editor.IContextKey<boolean>;

  renderStore: Record<string, RenderStoreItem>;

  constructor(
    editor: any,
    currentUser: string,
    onChange: OnActionsChanged,
    config?: ReviewManagerConfig,
    verbose?: boolean
  ) {
    this.currentUser = currentUser;
    this.editor = editor;
    this.activeComment = null; //TODO - consider moving onto the store
    this.widgetInlineToolbar = null;
    this.widgetInlineCommentEditor = null;
    this.onChange = onChange;
    this.editorMode = EditorMode.toolbar;
    this.config = {...defaultReviewManagerConfig, ...(config || {})};
    this.currentLineDecorations = [];
    this.currentCommentDecorations = [];
    this.currentLineDecorationLineNumber = null;
    this.events = [];
    this.store = {comments: {}}; //, viewZoneIdsToDelete: [] };
    this.renderStore = {};

    this.verbose = verbose;

    this.editorConfig = this.editor.getRawOptions();
    this.editor.onDidChangeConfiguration(
      () => (this.editorConfig = this.editor.getRawOptions())
    );
    this.editor.onMouseDown(this.handleMouseDown.bind(this));
    this.canAddCondition = this.editor.createContextKey(
      'add-context-key',
      !this.config.readOnly
    );
    this.inlineToolbarElements = this.createInlineToolbarWidget();
    this.editorElements = this.createInlineEditorWidget();
    this.addActions();

    if (this.config.showAddCommentGlyph) {
      this.editor.onMouseMove(this.handleMouseMove.bind(this));
    }
  }

  setReadOnlyMode(value: boolean) {
    this.config.readOnly = value;
    this.canAddCondition.set(!value);
    this.renderAddCommentLineDecoration(null);
  }

  load(events: ReviewCommentEvent[]): void {
    const store = reduceComments(events);
    this.loadFromStore(store, events);
  }

  loadFromStore(store: ReviewCommentStore, events: ReviewCommentEvent[]) {
    this.editor.changeViewZones(
      (changeAccessor: monacoEditor.editor.IViewZoneChangeAccessor) => {
        // Remove all the existing comments
        for (const viewState of Object.values(this.store.comments)) {
          const x = this.getRenderState(viewState.comment.id);
          if (x && x.viewZoneId !== null) {
            changeAccessor.removeZone(x.viewZoneId);
          }
        }

        this.events = events;
        this.store = store;
        this.store.deletedCommentIds = null;
        this.store.dirtyCommentIds = null;
        this.renderStore = {};

        this.refreshComments();

        this.verbose &&
        console.debug(
          'Events Loaded:',
          events.length,
          'Review Comments:',
          Object.values(this.store.comments).length
        );
      }
    );
  }

  getThemedColor(name: string): string {
    // editor.background: e {rgba: e}
    // editor.foreground: e {rgba: e}
    // editor.inactiveSelectionBackground: e {rgba: e}
    // editor.selectionHighlightBackground: e {rgba: e}
    // editorIndentGuide.activeBackground: e {rgba: e}
    // editorIndentGuide.background: e {rgba: e}
    const theme = (this.editor as any)._themeService._theme;
    let value = theme.getColor(name);

    // HACK - Buttons themes are not in monaco ... so just hack in theme for dark
    const missingThemes = {
      /*dark: {
        "button.background": "#0e639c",
        "button.foreground": "#ffffff",
      },
      light: {
        "button.background": "#007acc",
        "button.foreground": "#ffffff",
      },*/
    };
    if (!value) {
      value =
        missingThemes[theme.themeName.indexOf('dark') > -1 ? 'dark' : 'light'][
          name
          ];
    }
    return value;
  }

  createInlineEditButtonsElement(): InlineToolbarElements {
    const root = document.createElement('div') as HTMLDivElement;
    root.className = 'editButtonsContainer';
    root.style.marginLeft = this.config.editButtonOffset;

    const add = document.createElement('span') as HTMLSpanElement;
    add.innerText = this.config.replyButton.label;
    add.className = this.config.replyButton.class || 'editButton add';
    add.setAttribute(CONTROL_ATTR_NAME, '');
    add.onclick = () => this.setEditorMode(EditorMode.insertComment, 'add-comment');
    root.appendChild(add);

    let remove = null;
    let edit = null;
    let spacer = null;

    if (this.config.editButtonEnableRemove) {
      spacer = document.createElement('div') as HTMLDivElement;
      spacer.innerText = ' ';
      root.appendChild(spacer);

      remove = document.createElement('span') as HTMLSpanElement;
      remove.setAttribute(CONTROL_ATTR_NAME, '');
      remove.innerText = this.config.removeButton.label;
      remove.className = this.config.removeButton.class || 'editButton remove';
      remove.onclick = () => this.activeComment && this.removeComment(this.activeComment.id);
      root.appendChild(remove);
    }

    if (this.config.editButtonEnableEdit) {
      spacer = document.createElement('div') as HTMLDivElement;
      spacer.innerText = ' ';
      root.appendChild(spacer);

      edit = document.createElement('span') as HTMLSpanElement;
      edit.setAttribute(CONTROL_ATTR_NAME, '');
      edit.innerText = this.config.editButton.label || 'Edit';
      edit.className = this.config.editButton.class || 'editButton edit';
      edit.onclick = () => this.setEditorMode(EditorMode.editComment, 'edit');
      root.appendChild(edit);
    }

    return {root, add, remove, edit};
  }

  handleCancel() {
    this.setEditorMode(EditorMode.toolbar, 'cancel');
    this.editor.focus();
  }

  handleAddComment() {
    const lineNumber = this.activeComment
      ? this.activeComment.lineNumber
      : this.editor.getSelection().endLineNumber;
    const text = this.editorElements.textarea.value;
    const selection = this.activeComment
      ? null
      : (this.editor.getSelection() as CodeSelection);
    this.addComment(lineNumber, text, selection);
    this.setEditorMode(EditorMode.toolbar, 'add-comment-1');
    this.editor.focus();
  }

  handleTextAreaKeyDown(e: KeyboardEvent) {
    if (e.code === 'Escape') {
      this.handleCancel();
      e.preventDefault();
      console.info('preventDefault: Escape Key');
    } else if (e.code === 'Enter' && e.ctrlKey) {
      this.handleAddComment();
      e.preventDefault();
      console.info('preventDefault: ctrl+Enter');
    }
  }

  createInlineEditorElement(): EditorElements {
   const theme =  (this.editor as any)._themeService._theme.themeName.indexOf('dark') > -1 ? 'dark' : 'light'
    const root = document.createElement('div') as HTMLDivElement;
    root.className = 'reviewCommentEditor ' + theme;

    const textarea = document.createElement('textarea') as HTMLTextAreaElement;
    textarea.setAttribute(CONTROL_ATTR_NAME, '');
    textarea.className = 'reviewCommentEditor text';
    textarea.innerText = '';
    textarea.style.resize = 'none';
    textarea.style.width = '100%';
    textarea.name = 'text';
    textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);

    const confirm = document.createElement('button') as HTMLButtonElement;
    confirm.setAttribute(CONTROL_ATTR_NAME, '');
    confirm.className = this.config.addButton.class || 'reviewCommentEditor save';
    confirm.innerText = this.config.addButton.label || 'Add Comment';
    confirm.onclick = this.handleAddComment.bind(this);

    const cancel = document.createElement('button') as HTMLButtonElement;
    cancel.setAttribute(CONTROL_ATTR_NAME, '');
    cancel.className = this.config.cancelButton.class || 'reviewCommentEditor cancel';
    cancel.innerText = this.config.cancelButton.label || 'Cancel';
    cancel.onclick = this.handleCancel.bind(this);

    root.appendChild(textarea);
    root.appendChild(cancel);
    root.appendChild(confirm);

    return {root, confirm, cancel, textarea};
  }

  createInlineToolbarWidget() {
    const buttonsElement = this.createInlineEditButtonsElement();
    const this_ = this;

    this.widgetInlineToolbar = {
      allowEditorOverflow: true,
      getId: () => {
        return 'widgetInlineToolbar';
      },
      getDomNode: () => {
        return buttonsElement.root;
      },
      getPosition: () => {
        if (
          this_.activeComment &&
          this_.editorMode == EditorMode.toolbar &&
          !this_.config.readOnly
        ) {
          return {
            position: {
              lineNumber: this_.activeComment.lineNumber + 1,
              column: 1,
            },
            preference: [POSITION_EXACT],
          };
        }
      },
    };

    this.editor.addContentWidget(this.widgetInlineToolbar);
    return buttonsElement;
  }

  createInlineEditorWidget(): EditorElements {
    // doesn't re-theme when
    const editorElement = this.createInlineEditorElement();

    this.widgetInlineCommentEditor = {
      allowEditorOverflow: true,
      getId: () => {
        return 'widgetInlineEditor';
      },
      getDomNode: () => {
        console.log('getDomNode');
        return editorElement.root;
      },
      getPosition: () => {
        if (
          this.editorMode == EditorMode.insertComment ||
          this.editorMode == EditorMode.editComment
        ) {
          const position = this.editor.getPosition();

          return {
            position: {
              lineNumber: this.activeComment
                ? this.activeComment.lineNumber
                : position.lineNumber + 1,
              column: position.column,
            },
            preference: [POSITION_EXACT],
          };
        }
      },
    };

    this.editor.addContentWidget(this.widgetInlineCommentEditor);
    return editorElement;
  }

  setActiveComment(comment: ReviewComment) {
    this.verbose && console.debug('setActiveComment', comment);

    const lineNumbersToMakeDirty = [];
    if (
      this.activeComment &&
      (!comment || this.activeComment.lineNumber !== comment.lineNumber)
    ) {
      lineNumbersToMakeDirty.push(this.activeComment.lineNumber);
    }
    if (comment) {
      lineNumbersToMakeDirty.push(comment.lineNumber);
    }

    this.activeComment = comment;
    if (lineNumbersToMakeDirty.length > 0) {
      this.filterAndMapComments(lineNumbersToMakeDirty, (comment) => {
        this.renderStore[comment.id].renderStatus =
          ReviewCommentRenderState.dirty;
      });
    }
  }

  filterAndMapComments(
    lineNumbers: number[],
    fn: { (comment: ReviewComment): void }
  ) {
    for (const cs of Object.values(this.store.comments)) {
      if (lineNumbers.indexOf(cs.comment.lineNumber) > -1) {
        fn(cs.comment);
      }
    }
  }

  handleMouseMove(ev: monacoEditor.editor.IEditorMouseEvent) {
    if (ev.target && ev.target.position && ev.target.position.lineNumber) {
      this.currentLineDecorationLineNumber = ev.target.position.lineNumber;
      this.renderAddCommentLineDecoration(
        this.config.readOnly === true
          ? null
          : this.currentLineDecorationLineNumber
      );
    }
  }

  renderAddCommentLineDecoration(lineNumber?: number) {
    const lines = lineNumber
      ? [
        {
          range: new monacoWindow.monaco.Range(lineNumber, 0, lineNumber, 0),
          options: {
            marginClassName: 'activeLineMarginClass',
            zIndex: 100,
          },
        },
      ]
      : [];
    this.currentLineDecorations = this.editor.deltaDecorations(
      this.currentLineDecorations,
      lines
    );
  }

  handleMouseDown(ev: {
    target: {
      element: { className: string; hasAttribute: { (string): boolean } };
      detail: any;
    };
  }) {
    // Not ideal - but couldn't figure out a different way to identify the glyph event
    if (
      ev.target.element.className &&
      ev.target.element.className.indexOf('activeLineMarginClass') > -1
    ) {
      this.editor.setPosition({
        lineNumber: this.currentLineDecorationLineNumber,
        column: 1,
      });
      this.setEditorMode(EditorMode.insertComment, 'mouse-down-1');
    } else if (!ev.target.element.hasAttribute(CONTROL_ATTR_NAME)) {
      let activeComment: ReviewComment = null;

      if (ev.target.detail && ev.target.detail.viewZoneId !== null) {
        for (const comment of Object.values(this.store.comments).map(
          (c) => c.comment
        )) {
          const x = this.getRenderState(comment.id);
          if (x.viewZoneId == ev.target.detail.viewZoneId) {
            activeComment = comment;
            break;
          }
        }
      }
      this.setActiveComment(activeComment);
      this.refreshComments();
      this.setEditorMode(EditorMode.toolbar, 'mouse-down-2');
    }
  }

  private calculateMarginTopOffset(
    includeActiveCommentHeight: boolean
  ): number {
    let count = 0;
    let marginTop = 0;
    const lineHeight = this.editorConfig.lineHeight;

    if (this.activeComment) {
      for (let item of this.iterateComments()) {
        if (
          item.state.comment.lineNumber === this.activeComment.lineNumber &&
          (item.state.comment != this.activeComment ||
            includeActiveCommentHeight)
        ) {
          count += this.calculateNumberOfLines(item.state.comment.text);
        }

        if (item.state.comment == this.activeComment) {
          break;
        }
      }
      marginTop = count * lineHeight;
    }
    return marginTop + this.config.verticalOffset;
  }

  layoutInlineToolbar() {
    this.inlineToolbarElements.root.style.backgroundColor = this.getThemedColor('editor.background');
    this.inlineToolbarElements.root.style.marginTop = `${this.calculateMarginTopOffset(false)}px`;

    if (this.inlineToolbarElements.remove) {
      const hasChildren =
        this.activeComment &&
        this.iterateComments((c) => c.comment.id === this.activeComment.id).length > 1;
      const isSameUser = this.activeComment && this.activeComment.author === this.currentUser;
      this.inlineToolbarElements.remove.style.display = hasChildren ? 'none' : '';
      this.inlineToolbarElements.edit.style.display = hasChildren || !isSameUser ? 'none' : '';
    }

    this.editor.layoutContentWidget(this.widgetInlineToolbar);
  }

  layoutInlineCommentEditor() {
    [this.editorElements.root, this.editorElements.textarea].forEach((e) => {
      e.style.backgroundColor = this.getThemedColor('editor.background');
      e.style.color = this.getThemedColor('editor.foreground');
    });

    this.editorElements.confirm.innerText =
      this.editorMode === EditorMode.insertComment
        ? this.config.addButton.label || 'Add Comment'
        : 'Edit Comment';
    // this.editorElements.root.style.marginTop = `${this.calculateMarginTopOffset(
    //   true
    // )}px`;
    this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
  }

  setEditorMode(mode: EditorMode, why: string = null) {
    this.editorMode = this.config.readOnly ? EditorMode.toolbar : mode;
    this.layoutInlineToolbar();
    this.layoutInlineCommentEditor();
    if (mode === EditorMode.insertComment || mode === EditorMode.editComment) {
      if (mode === EditorMode.insertComment) {
        this.editorElements.textarea.value = '';
      } else if (mode === EditorMode.editComment) {
        this.editorElements.textarea.value = this.activeComment
          ? this.activeComment.text
          : '';
      }
      // HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...
      setTimeout(() => this.editorElements.textarea.focus(), 100); //TODO - make configurable
    }
  }

  getDateTimeNow() {
    return new Date();
  }

  private recurseComments(
    allComments: { [key: string]: ReviewCommentState },
    filterFn: { (c: ReviewCommentState): boolean },
    depth: number,
    results: ReviewCommentIterItem[]
  ) {
    const comments = Object.values(allComments).filter(filterFn);
    for (const cs of comments) {
      const comment = cs.comment;
      delete allComments[comment.id];

      results.push({
        depth,
        state: cs,
      });
      this.recurseComments(
        allComments,
        (x) => x.comment.parentId === comment.id,
        depth + 1,
        results
      );
    }
  }

  private iterateComments(filterFn?: { (c: ReviewCommentState): boolean }) {
    if (!filterFn) {
      filterFn = (cs: ReviewCommentState) => !cs.comment.parentId;
    }
    const copyCommentState = {...this.store.comments};
    const results: ReviewCommentIterItem[] = [];
    this.recurseComments(copyCommentState, filterFn, 0, results);
    return results;
  }

  removeComment(id: string) {
    return this.addEvent({type: 'delete', targetId: id});
  }

  addComment(lineNumber: number, text: string, selection?: CodeSelection) {
    const event: ReviewCommentEvent =
      this.editorMode === EditorMode.editComment
        ? {type: 'edit', text, targetId: this.activeComment.id}
        : {
          type: 'create',
          text,
          lineNumber,
          selection,
          targetId: this.activeComment && this.activeComment.id,
        };

    return this.addEvent(event);
  }

  private addEvent(event: ReviewCommentEvent) {
    event.createdBy = this.currentUser;
    event.createdAt = this.getDateTimeNow();
    event.id = uuid.v4();

    this.events.push(event);
    this.store = commentReducer(event, this.store);

    if (this.activeComment && !this.store.comments[this.activeComment.id]) {
      this.setActiveComment(null);
    } else if (
      this.activeComment &&
      this.activeComment.status === ReviewCommentStatus.deleted
    ) {
      this.setActiveComment(null);
    }

    this.refreshComments();
    this.layoutInlineToolbar();

    if (this.onChange) {
      this.onChange(this.events);
    }

    return event;
  }

  private formatDate(dt: Date | string) {
    if (this.config.formatDate) {
      return this.config.formatDate(dt);
    } else if (dt instanceof Date) {
      return dt.toISOString();
    } else {
      return dt;
    }
  }

  private static createElement(
    text: string,
    className: string,
    tagName: string = null
  ) {
    const span = document.createElement(tagName || 'span') as HTMLSpanElement;
    span.className = className;
    span.innerText = text;
    return span;
  }

  getRenderState(commentId: string): RenderStoreItem {
    if (!this.renderStore[commentId]) {
      this.renderStore[commentId] = {viewZoneId: null, renderStatus: null};
    }
    return this.renderStore[commentId];
  }

  refreshComments() {
    this.editor.changeViewZones(
      (changeAccessor: {
        addZone: {
          (zone: {
            afterLineNumber: number;
            heightInLines: number;
            domNode: HTMLElement;
            suppressMouseDown: boolean;
          }): string;
        };
        removeZone: { (id: string): void };
      }) => {
        const lineNumbers: { [key: number]: CodeSelection } = {};

        for (const cid of Array.from(this.store.deletedCommentIds || [])) {
          const viewZoneId = this.renderStore[cid]?.viewZoneId;
          changeAccessor.removeZone(viewZoneId);
          this.verbose && console.debug('Zone.Delete', viewZoneId);
        }
        this.store.deletedCommentIds = null;

        for (const cid of Array.from(this.store.dirtyCommentIds || [])) {
          this.getRenderState(cid).renderStatus =
            ReviewCommentRenderState.dirty;
        }
        this.store.dirtyCommentIds = null;

        for (const item of this.iterateComments()) {
          const rs = this.getRenderState(item.state.comment.id);

          if (rs.renderStatus === ReviewCommentRenderState.hidden) {
            this.verbose && console.debug('Zone.Hidden', item.state.comment.id);

            changeAccessor.removeZone(rs.viewZoneId);
            rs.viewZoneId = null;

            continue;
          }

          if (rs.renderStatus === ReviewCommentRenderState.dirty) {
            this.verbose && console.debug('Zone.Dirty', item.state.comment.id);

            changeAccessor.removeZone(rs.viewZoneId);
            rs.viewZoneId = null;
            rs.renderStatus = ReviewCommentRenderState.normal;
          }

          if (!lineNumbers[item.state.comment.lineNumber]) {
            lineNumbers[item.state.comment.lineNumber] =
              item.state.comment.selection;
          }

          if (rs.viewZoneId == null) {
            this.verbose && console.debug('Zone.Create', item.state.comment.id);

            const isActive = this.activeComment == item.state.comment;

            const domNode = ReviewManager.createElement(
              '',
              `reviewComment ${isActive ? 'active' : ' inactive'}`
            );
            domNode.style.paddingLeft =
              this.config.commentIndent * (item.depth + 1) +
              this.config.commentIndentOffset +
              'px';
            domNode.style.backgroundColor = this.getThemedColor('editor.selectionHighlightBackground');

            // For Debug - domNode.appendChild(this.createElement(`${item.state.comment.id}`, 'reviewComment id'))

            domNode.appendChild(
              ReviewManager.createElement(
                `${item.state.comment.author || ' '}`,
                'reviewComment author'
              )
            );
            domNode.appendChild(ReviewManager.createElement(' at ' + this.formatDate(item.state.comment.dt), 'reviewComment dt')
            );
            if (item.state.history.length > 1) {
              domNode.appendChild(
                ReviewManager.createElement(
                  `(Edited ${item.state.history.length - 1} times)`,
                  'reviewComment history'
                )
              );
            }
            domNode.appendChild(
              ReviewManager.createElement(
                `${item.state.comment.text}`,
                'reviewComment text',
                'div'
              )
            );
            //todo jxb fixme
            //   function getTextWidth() {

            //     text = document.createElement("span");
            //     document.body.appendChild(text);

            //     text.style.font = "times new roman";
            //     text.style.fontSize = 16 + "px";
            //     text.style.height = 'auto';
            //     text.style.width = 'auto';
            //     text.style.position = 'absolute';
            //     text.style.whiteSpace = 'no-wrap';
            //     text.innerHTML = 'Hello World';

            //     width = Math.ceil(text.clientWidth);
            //     formattedWidth = width + "px";

            //     document.querySelector('.output').textContent
            //             = formattedWidth;
            //     document.body.removeChild(text);
            // }
            rs.viewZoneId = changeAccessor.addZone({
              afterLineNumber: item.state.comment.lineNumber,
              heightInLines: this.calculateNumberOfLines(item.state.comment.text),
              domNode: domNode,
              suppressMouseDown: true, // This stops focus being lost the editor - meaning keyboard shortcuts keeps working
            });
          }
        }

        if (this.config.showInRuler) {
          const decorators = [];
          for (const [ln, selection] of Object.entries(lineNumbers)) {
            decorators.push({
              range: new monacoWindow.monaco.Range(ln, 0, ln, 0),
              options: {
                isWholeLine: true,
                overviewRuler: {
                  color: this.config.rulerMarkerColor,
                  darkColor: this.config.rulerMarkerDarkColor,
                  position: 2,
                },
              },
            });

            if (selection) {
              decorators.push({
                range: new monacoWindow.monaco.Range(
                  selection.startLineNumber,
                  selection.startColumn,
                  selection.endLineNumber,
                  selection.endColumn
                ),
                options: {
                  className: 'reviewComment selection',
                },
              });
            }
          }

          this.currentCommentDecorations = this.editor.deltaDecorations(
            this.currentCommentDecorations,
            decorators
          );
        }
      }
    );
  }

  calculateNumberOfLines(text: string): number {
    return text ? text.split(/\r*\n/).length + 1 : 1;
  }

  addActions() {
    this.editor.addAction({
      id: 'my-unique-id-add',
      label: this.config.addButton.label || 'Add Comment',
      keybindings: [
        monacoWindow.monaco?.KeyMod.CtrlCmd | monacoWindow.monaco?.KeyCode.F10,
      ],
      precondition: 'add-context-key',
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 0,

      run: () => {
        this.setEditorMode(EditorMode.insertComment, 'add-comment-x');
      },
    });

    this.editor.addAction({
      id: 'my-unique-id-next',
      label: 'Next Comment',
      keybindings: [
        monacoWindow.monaco?.KeyMod.CtrlCmd | monacoWindow.monaco?.KeyCode.F12,
      ],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 0.101,

      run: () => {
        this.navigateToComment(NavigationDirection.next);
      },
    });

    this.editor.addAction({
      id: 'my-unique-id-prev',
      label: 'Prev Comment',
      keybindings: [
        monacoWindow.monaco?.KeyMod.CtrlCmd | monacoWindow.monaco?.KeyCode.F11,
      ],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 0.102,

      run: () => {
        this.navigateToComment(NavigationDirection.prev);
      },
    });
  }

  navigateToComment(direction: NavigationDirection) {
    let currentLine = 0;
    if (this.activeComment) {
      currentLine = this.activeComment.lineNumber;
    } else {
      currentLine = this.editor.getPosition().lineNumber;
    }

    const comments = Object.values(this.store.comments)
      .map((cs) => cs.comment)
      .filter((c) => {
        if (!c.parentId) {
          if (direction === NavigationDirection.next) {
            return c.lineNumber > currentLine;
          } else if (direction === NavigationDirection.prev) {
            return c.lineNumber < currentLine;
          }
        }
      });

    if (comments.length) {
      comments.sort((a, b) => {
        if (direction === NavigationDirection.next) {
          return a.lineNumber - b.lineNumber;
        } else if (direction === NavigationDirection.prev) {
          return b.lineNumber - a.lineNumber;
        }
      });

      const comment = comments[0];
      this.setActiveComment(comment);
      this.refreshComments();
      this.layoutInlineToolbar();
      this.editor.revealLineInCenter(comment.lineNumber);
    }
  }

  updateConfig(config: ReviewManagerConfig) {
    this.config = {...defaultReviewManagerConfig, ...(config || {})};
  }
}
