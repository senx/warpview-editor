/*
 *  Copyright 2020-2022 SenX S.A.S.
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

import {v4} from 'uuid';

export type CommonFields = {
  id?: string;
  targetId?: string;
  createdBy?: string;
  createdAt?: Date | string;
  // script on here maybe?
};

export type ReviewCommentEvent =
  | ({
  type: 'create';
  lineNumber: number;
  text: string;
  selection?: CodeSelection;
} & CommonFields)
  | ({ type: 'edit'; text: string } & CommonFields)
  | ({ type: 'delete' } & CommonFields);

export interface CommentState {
  comments: Record<string, ReviewCommentState>;
  deletedCommentIds?: Set<string>;
  dirtyCommentIds?: Set<string>;
}

export function commentReducer(event: ReviewCommentEvent, state: CommentState) {
  const dirtyLineNumbers = new Set<number>();
  const deletedCommentIds = new Set<string>();
  const dirtyCommentIds = new Set<string>();
  let comments = {...state.comments};

  switch (event.type) {
    case 'edit':
      const parent = comments[event.targetId];
      if (!parent) {
        break;
      }

      const edit: ReviewCommentState = {
        comment: {
          ...parent.comment,
          author: event.createdBy,
          dt: event.createdAt,
          text: event.text,
        },
        history: parent.history.concat(parent.comment),
      };

      dirtyLineNumbers.add(edit.comment.lineNumber);
      console.debug('edit', event);

      comments[event.targetId] = edit;
      break;

    case 'delete':
      const selected = comments[event.targetId];
      if (!selected) {
        break;
      }

      delete comments[event.targetId];

      deletedCommentIds.add(selected.comment.id);
      dirtyLineNumbers.add(selected.comment.lineNumber);
      console.debug('delete', event);
      break;

    case 'create':
      if (!comments[event.id]) {
        comments[event.id] = new ReviewCommentState({
          author: event.createdBy,
          dt: event.createdAt,
          id: event.id,
          lineNumber: event.lineNumber,
          selection: event.selection,
          text: event.text,
          parentId: event.targetId,
          status: ReviewCommentStatus.active,
        });
        console.debug('insert', event);
        dirtyLineNumbers.add(event.lineNumber);
      }
      break;
  }

  if (dirtyLineNumbers.size) {
    for (const cs of Object.values(state.comments)) {
      if (dirtyLineNumbers.has(cs.comment.lineNumber)) {
        dirtyCommentIds.add(cs.comment.id);
      }
    }
  }

  return {comments, dirtyCommentIds, deletedCommentIds};
}

export class ReviewCommentState {
  comment: ReviewComment;
  history: ReviewComment[];

  constructor(comment: ReviewComment) {
    this.comment = comment;
    this.history = [comment];
  }
}

export enum ReviewCommentRenderState {
  dirty = 1,
  hidden = 2,
  normal = 3,
}

export interface CodeSelection {
  startColumn: number;
  endColumn: number;
  startLineNumber: number;
  endLineNumber: number;
}

export interface ReviewComment {
  id: string;
  parentId?: string;
  author: string;
  dt: Date | string;
  lineNumber: number;
  text: string;
  selection: CodeSelection;
  status: ReviewCommentStatus;
}

export enum ReviewCommentStatus {
  active = 1,
  deleted = 2,
  edit = 3,
}

export function reduceComments(
  actions: ReviewCommentEvent[],
  state: CommentState = null
) {
  state = state || {comments: {}};

  for (const a of actions) {
    if (!a.id) {
      a.id = v4();
    }
    state = commentReducer(a, state);
  }

  return state;
}
