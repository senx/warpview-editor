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

export class Monarch {
        public static rules:any =  {
    "keywords": [
        "MAP",
        "FILTER",
        "APPLY",
        "REDUCE",
        "BUCKETIZE",
        "->GEOJSON",
        "SIZE",
        "mapper.truecourse",
        "mapper.hdist",
        "mapper.geo.within",
        "mapper.geo.outside",
        "mapper.geo.clear",
        "mapper.geo.approximate",
        "LOCSTRINGS",
        "LOCATIONS",
        "HHCODE.SOUTH.WEST",
        "HHCODE.SOUTH.EAST",
        "HHCODE.NORTH.WEST",
        "HHCODE.NORTH.EAST",
        "HHCODE.WEST",
        "HHCODE.EAST",
        "HHCODE.SOUTH",
        "HHCODE.NORTH",
        "HHCODE.CENTER",
        "HHCODE.BBOX",
        "HAVERSINE",
        "HHCODE->",
        "GTSHHCODE->",
        "GEOHASH->",
        "GEOUNPACK",
        "GEOPACK",
        "GEO.WKT.UNIFORM",
        "GEO.WKT",
        "GEO.WKB.UNIFORM",
        "GEO.WKB",
        "GEO.WITHIN",
        "GEO.UNION",
        "GEO.REGEXP",
        "GEO.OPTIMIZE",
        "GEO.JSON",
        "GEO.JSON.UNIFORM",
        "GEO.INTERSECTS",
        "GEO.INTERSECTION",
        "GEO.DIFFERENCE",
        "GEO.COVER.RL",
        "GEO.COVER",
        "ELEVATIONS",
        "BBOX",
        "->HHCODELONG",
        "->HHCODE",
        "->GTSHHCODE",
        "->GTSHHCODELONG",
        "->GEOHASH",
        "MOTIONSPLIT",
        "LASTACTIVITY",
        "REMOVETICK",
        "ZSCORETEST",
        "ZSCORE",
        "ZPATTERNS",
        "ZPATTERNDETECTION",
        "ZDTW",
        "ZDISCORDS",
        "WRAPMV",
        "WRAPRAWOPT",
        "WRAPRAW",
        "WRAPOPT",
        "WRAPFAST",
        "WRAP",
        "GOLDWRAP",
        "VALUESPLIT",
        "VALUESORT",
        "VALUES",
        "VALUEHISTOGRAM",
        "VALUEDEDUP",
        "UPDATE",
        "UNWRAPSIZE",
        "UNWRAPENCODER",
        "UNWRAPEMPTY",
        "UNWRAP",
        "UNBUCKETIZE",
        "TOSELECTOR",
        "TOBITS",
        "TLTTB",
        "TIMESPLIT",
        "TIMESHIFT",
        "TIMESCALE",
        "TIMEMODULO",
        "TIMECLIP",
        "TICKS",
        "TICKLIST",
        "TICKINDEX",
        "THRESHOLDTEST",
        "STRICTPARTITION",
        "STLESDTEST",
        "STL",
        "STANDARDIZE",
        "SORTWITH",
        "SORTBY",
        "SORT",
        "SMARTPARSE",
        "SKEWNESS",
        "SIZE",
        "SINGLEEXPONENTIALSMOOTHING",
        "SHRINK",
        "SETVALUE",
        "SETATTRIBUTES",
        "RVALUESORT",
        "RSORT",
        "RLOWESS",
        "RESETS",
        "RENAME",
        "RELABEL",
        "RAWDTW",
        "RANGECOMPACT",
        "QUANTIZE",
        "PROB",
        "PIVOTSTRICT",
        "PIVOT",
        "PATTERNS",
        "PATTERNDETECTION",
        "PARTITION",
        "PARSEVALUE",
        "PARSESELECTOR",
        "PARSE",
        "PAPPLY",
        "OPTIMIZE",
        "ONLYBUCKETS",
        "NSUMSUMSQ",
        "NORMALIZE",
        "NONEMPTY",
        "NEWGTS",
        "NAME",
        "MVELEVATIONS",
        "MVLOCATIONS",
        "MVHHCODES",
        "MVVALUES",
        "MVTICKS",
        "MVTICKSPLIT",
        "MVINDEXSPLIT",
        "MUSIGMA",
        "MONOTONIC",
        "MODE",
        "METASORT",
        "METASET",
        "METADIFF",
        "META",
        "MERGE",
        "MAXGTS",
        "mapper.percentile",
        "mapper.npdf",
        "mapper.mod",
        "mapper.median.forbid-nulls",
        "mapper.median",
        "mapper.finite",
        "MAKEGTS",
        "LTTB",
        "LR",
        "LOWESS",
        "LOCSTRINGS",
        "LOCATIONS",
        "LOCATIONOFFSET",
        "LASTTICK",
        "LASTSORT",
        "LASTBUCKET",
        "LABELS",
        "KURTOSIS",
        "ISONORMALIZE",
        "INTEGRATE",
        "IFFT",
        "IDWT",
        "HYBRIDTEST2",
        "HYBRIDTEST",
        "GRUBBSTEST",
        "ENCODER->",
        "GEO.WITHIN",
        "GEO.INTERSECTS",
        "FUSE",
        "FIRSTTICK",
        "FINDSTATS",
        "FINDSETS",
        "FIND",
        "filter.latencies",
        "FILLVALUE",
        "FILLTICKS",
        "FILLPREVIOUS",
        "FILLNEXT",
        "FFTWINDOW",
        "FFTAP",
        "FFT",
        "FETCHSTRING",
        "FETCHLONG",
        "FETCHDOUBLE",
        "FETCHBOOLEAN",
        "FETCH",
        "FDWT",
        "ESDTEST",
        "EMPTY",
        "ELEVATIONS",
        "DWTSPLIT",
        "DTW",
        "DOUBLEEXPONENTIALSMOOTHING",
        "DISCORDS",
        "DELETE",
        "DEDUP",
        "CPROB",
        "CORRELATE",
        "COPYGEO",
        "COMPACT",
        "COMMONTICKS",
        "CLONEEMPTY",
        "CLONE",
        "CLIP",
        "CHUNK",
        "BUCKETSPAN",
        "BUCKETIZE",
        "BUCKETCOUNT",
        "BBOX",
        "ATTRIBUTES",
        "ATTICK",
        "ATINDEX",
        "ATBUCKET",
        "APPLY",
        "->MVSTRING",
        "->GTS",
        "->ENCODERS",
        "->DOUBLEBITS",
        "ADDVALUE",
        "ASENCODERS",
        "WRAPMV",
        "WRAPRAWOPT",
        "WRAPRAW",
        "WRAPFAST",
        "WRAP",
        "SETATTRIBUTES",
        "RENAME",
        "NEWENCODER",
        "MVELEVATIONS",
        "MVLOCATIONS",
        "MVHHCODES",
        "MVVALUES",
        "MVTICKS",
        "MVTICKSPLIT",
        "MVINDEXSPLIT",
        "ENCODER->",
        "CHUNKENCODER",
        "->MVSTRING",
        "->GTS",
        "->ENCODERS",
        "->ENCODER",
        "ASENCODERS",
        "->LONGBYTES",
        "INFLATE",
        "UNGZIP",
        "TOTIMESTAMP",
        "TOSTRING",
        "TORADIANS",
        "TOLONG",
        "TOHEX",
        "TODOUBLE",
        "TODEGREES",
        "TOBOOLEAN",
        "TOBIN",
        "OPB64TOHEX",
        "MVELEVATIONS",
        "MVLOCATIONS",
        "MVHHCODES",
        "MVVALUES",
        "MVTICKS",
        "MVTICKSPLIT",
        "MVINDEXSPLIT",
        "Z->",
        "VEC->",
        "V->",
        "OPB64->",
        "MAT->",
        "MAP->",
        "LIST->",
        "HEXTOBIN",
        "HEXTOB64",
        "HEX->",
        "JSON->",
        "FLOATBITS->",
        "DEFLATE",
        "GZIP",
        "ENCODER->",
        "DOUBLEBITS->",
        "BIN->",
        "B64URL->",
        "B64->",
        "FROMHEX",
        "FROMBITS",
        "FROMBIN",
        "BYTES->",
        "BYTESTOBITS",
        "BITSTOBYTES",
        "BINTOHEX",
        "B64TOHEX",
        "->Z",
        "->VEC",
        "->V",
        "->OPB64",
        "->MAT",
        "->MAP",
        "->LIST",
        "->JSON",
        "->HEX",
        "->GTS",
        "->ENCODERS",
        "->ENCODER",
        "->BYTES",
        "->BIN",
        "->B64URL",
        "->B64",
        "STRINGFORMAT",
        "URLENCODE",
        "URLDECODE",
        "TRIM",
        "TOUPPER",
        "TOSTRING",
        "TOLOWER",
        "TOBIN",
        "TEMPLATE",
        "SUBSTRING",
        "SPLIT",
        "SMARTPARSE",
        "SIZE",
        "REVERSE",
        "REPLACEALL",
        "REPLACE",
        "REOPTALT",
        "PARSE",
        "MATCHER",
        "MATCH",
        "JOIN",
        "HASH",
        "BIN->",
        "B64URL->",
        "B64->",
        "BYTES->",
        "CLONEREVERSE",
        "BINTOHEX",
        "B64TOHEX",
        "->B64URL",
        "->B64",
        "SHUFFLE",
        "SHAPE",
        "RESHAPE",
        "PERMUTE",
        "HULLSHAPE",
        "CHECKSHAPE",
        "GROUPBY",
        "FILTERBY",
        "ZIP",
        "UNPACK",
        "UNLIST",
        "UNIQUE",
        "SUBLIST",
        "SORTWITH",
        "SORTBY",
        "SIZE",
        "SET",
        "REVERSE",
        "REMOVE",
        "PACK",
        "]",
        "LSORT",
        "[]",
        "[[]]",
        "LMAP",
        "[",
        "LFLATMAP",
        "VEC->",
        "V->",
        "IMMUTABLE",
        "MAT->",
        "LIST->",
        "GET",
        "FLATTEN",
        "CONTAINS",
        "CLONEREVERSE",
        "CLONE",
        "APPEND",
        "->VEC",
        "->MAT",
        "->LIST",
        "+!",
        "SHAPE",
        "RESHAPE",
        "PERMUTE",
        "HULLSHAPE",
        "CHECKSHAPE",
        "->LONGBYTES",
        "~",
        "|",
        "TOLONG",
        "TOBIN",
        "SUBSTRING",
        "SET",
        "REVERSE",
        "^",
        "HEXTOBIN",
        "FLOATBITS->",
        "GET",
        "DOUBLEBITS->",
        "BIN->",
        "FROMBITS",
        "FROMBIN",
        "CLONEREVERSE",
        "BYTESTOBITS",
        "BITSTOBYTES",
        "BITGET",
        "BITCOUNT",
        "BINTOHEX",
        "->FLOATBITS",
        "->DOUBLEBITS",
        "->BIN",
        "&",
        "PtoImage",
        "PshapeMode",
        "Pshape",
        "PloadShape",
        "Pvertex",
        "PupdatePixels",
        "Ptriangle",
        "Ptranslate",
        "Ptint",
        "PtextWidth",
        "PtextSize",
        "PtextMode",
        "PtextLeading",
        "PtextFont",
        "PtextDescent",
        "PtextAscent",
        "PtextAlign",
        "Ptext",
        "PstrokeWeight",
        "PstrokeJoin",
        "PstrokeCap",
        "Pstroke",
        "PsphereDetail",
        "Psphere",
        "PshearY",
        "PshearX",
        "Pset",
        "Pscale",
        "Psaturation",
        "Protate",
        "PresetMatrix",
        "Pred",
        "PrectMode",
        "Prect",
        "PquadraticVertex",
        "Pquad",
        "PpushStyle",
        "PpushMatrix",
        "PpopStyle",
        "PpopMatrix",
        "Ppoint",
        "Ppixels",
        "PnoTint",
        "PnoStroke",
        "Pnorm",
        "PnoFill",
        "PnoClip",
        "Pmap",
        "Pmag",
        "Pline",
        "PlerpColor",
        "Plerp",
        "PimageMode",
        "Pimage",
        "Phue",
        "Pgreen",
        "PGraphics",
        "Pget",
        "Pfill",
        "PendShape",
        "PendContour",
        "Pencode",
        "PellipseMode",
        "Pellipse",
        "Pdist",
        "Pdecode",
        "PcurveVertex",
        "PcurveTightness",
        "PcurveTangent",
        "PcurvePoint",
        "PcurveDetail",
        "Pcurve",
        "PcreateFont",
        "Pcopy",
        "Pconstrain",
        "PcolorMode",
        "Pcolor",
        "Pclip",
        "Pclear",
        "Pbrightness",
        "Pbox",
        "Pblue",
        "PblendMode",
        "Pblend",
        "PbezierVertex",
        "PbezierTangent",
        "PbezierPoint",
        "PbezierDetail",
        "Pbezier",
        "PbeginShape",
        "PbeginContour",
        "Pbackground",
        "Parc",
        "Palpha",
        "Pfilter",
        "TIMED",
        "CHRONOSTATS",
        "CHRONOSTART",
        "CHRONOEND",
        "LOGEVENT->",
        "TDESCRIBE",
        "TYPEOF",
        "STOP",
        "SECTION",
        "LINEON",
        "LINEOFF",
        "GETSECTION",
        "EXPORT",
        "ASSERTMSG",
        "ASSERT",
        "URLFETCH",
        "MAXURLFETCHSIZE",
        "MAXURLFETCHCOUNT",
        "TOKENSECRET",
        "TOKENGEN",
        "TOKENDUMP",
        "SHMSTORE",
        "SHMLOAD",
        "MUTEX",
        "SENSISION.DUMPEVENTS",
        "SENSISION.DUMP",
        "SENSISION.UPDATE",
        "SENSISION.SET",
        "SENSISION.GET",
        "SENSISION.EVENT",
        "HLOCATE",
        "FUNCTIONS",
        "TDESCRIBE",
        "STDOUT",
        "STDERR",
        "NOLOG",
        "LOGMSG",
        "SYNC",
        "REXECZ",
        "REXEC",
        "CEVAL",
        "URLFETCH",
        "MAXURLFETCHSIZE",
        "MAXURLFETCHCOUNT",
        "WEBCALL",
        "WF.SETREPOS",
        "WF.GETREPOS",
        "WF.ADDREPO",
        "WFOFF",
        "WFON",
        "IMPORT",
        "VARS",
        "TIMEON",
        "TIMEOFF",
        "SHMSTORE",
        "SHMLOAD",
        "PSTACK",
        "PEEKN",
        "PEEK",
        "NPEEK",
        "MUTEX",
        "WSSTACK",
        "JSONSTACK",
        "ECHOON",
        "ECHOOFF",
        "PUSHR",
        "POPR",
        "CPOPR",
        "CLEARREGS",
        "ASREGS",
        "UNSECURE",
        "TYPEOF",
        "TIMINGS",
        "SYMBOLS",
        "SWAP",
        "STORE",
        "STOP",
        "STACKTOLIST",
        "STACKATTRIBUTE",
        "SNAPSHOTTOMARK",
        "SNAPSHOTN",
        "SNAPSHOTCOPYTOMARK",
        "SNAPSHOTCOPYN",
        "SNAPSHOTCOPYALLTOMARK",
        "SNAPSHOTCOPYALL",
        "SNAPSHOTCOPY",
        "SNAPSHOTALLTOMARK",
        "SNAPSHOTALL",
        "SNAPSHOT",
        "SECUREKEY",
        "SECURE",
        "SECTION",
        "SAVE",
        "RUNNERNONCE",
        "ROT",
        "ROLLD",
        "ROLL",
        "REXECZ",
        "REXEC",
        "RESTORE",
        "RESET",
        "REPORT",
        "REDEFS",
        "PIGSCHEMA",
        "PICK",
        "NOTIMINGS",
        "NDEBUGON",
        "MAXDEPTH",
        "MARK",
        "LOAD",
        "[",
        "LINEON",
        "LINEOFF",
        "ISAUTHENTICATED",
        "IDENT",
        "HEADER",
        "GETSECTION",
        "FORGET",
        "EXTLOADED",
        "EXPORT",
        "EVALSECURE",
        "ERROR",
        "ELAPSED",
        "DUPN",
        "DUP",
        "DROPN",
        "DROP",
        "DEREF",
        "DEPTH",
        "DEF",
        "DEBUGON",
        "DEBUGOFF",
        "CSTORE",
        "COUNTTOMARK",
        "CLEARTOMARK",
        "CLEARSYMBOLS",
        "CLEARDEFS",
        "CLEAR",
        "BOOTSTRAP",
        "AUTHENTICATE",
        "UPDATEON",
        "UPDATEOFF",
        "TOKENSECRET",
        "TIMEBOX",
        "METAON",
        "METAOFF",
        "DELETEON",
        "DELETEOFF",
        "TOKENGEN",
        "TOKENDUMP",
        "FUNCTIONS",
        "UPDATE",
        "TOKENINFO",
        "STU",
        "SETMACROCONFIG",
        "RUN",
        "REV",
        "OPS",
        "NOOP",
        "MSTU",
        "MINREV",
        "MAXSYMBOLS",
        "MAXRECURSION",
        "MAXPIXELS",
        "MAXOPS",
        "MAXLOOP",
        "MAXGTS",
        "MAXGEOCELLS",
        "MAXDEPTH",
        "MAXBUCKETS",
        "MACROTTL",
        "MACROCONFIGSECRET",
        "MACROCONFIGDEFAULT",
        "MACROCONFIG",
        "LIMIT",
        "JSONSTRICT",
        "JSONLOOSE",
        "PICKLE->",
        "INFOMODE",
        "INFO",
        "GETHOOK",
        "EVERY",
        "CALL",
        "->PICKLE",
        "filler.trend",
        "filler.previous",
        "filler.next",
        "filler.interpolate",
        "MACROFILLER",
        "FILL",
        "TOINTEXACT",
        "SUBTRACTEXACT",
        "SCALB",
        "RANDOM",
        "NEXTDOWN",
        "NEGATEEXACT",
        "MULTIPLYEXACT",
        "INCREMENTEXACT",
        "GETEXPONENT",
        "FLOORMOD",
        "FLOORDIV",
        "DECREMENTEXACT",
        "ADDEXACT",
        "~=",
        "~",
        "ULP",
        "TRANSPOSE",
        "TR",
        "TOBITS",
        "TANH",
        "TAN",
        "SRANDPDF",
        "SRAND",
        "SQRT",
        "SINH",
        "SIN",
        "SIGNUM",
        "ROUND",
        "RINT",
        "REVBITS",
        "RANDPDF",
        "RAND",
        "pi",
        "PROBABILITY",
        "PRNG",
        "OPTDTW",
        "e",
        "NPDF",
        "NONNULL",
        "NEXTUP",
        "NEXTAFTER",
        "NBOUNDS",
        "MINLONG",
        "MIN",
        "MAXLONG",
        "MAX",
        "LOG1P",
        "LOG10",
        "LOG",
        "LBOUNDS",
        "VEC->",
        "PI",
        "ISNULL",
        "ISNaN",
        "INV",
        "MAT->",
        "HYPOT",
        "E",
        "FLOOR",
        "FDWT",
        ">=",
        "EXPM1",
        "EXP",
        ">",
        "==",
        "<=",
        "<",
        "DET",
        "COSH",
        "COS",
        "COPYSIGN",
        "CEIL",
        "CBRT",
        "ATAN2",
        "ATAN",
        "ASIN",
        "/",
        "->VEC",
        "->MAT",
        "->FLOATBITS",
        "->DOUBLEBITS",
        "ACOS",
        "ABS",
        "**",
        "+",
        "COUNTERSET",
        "RANGE",
        "COUNTERVALUE",
        "COUNTERDELTA",
        "COUNTER",
        "F",
        "T",
        "||",
        "reducer.and",
        "reducer.and.exclude-nulls",
        "OR",
        "NOT",
        "NONNULL",
        "mapper.or",
        "mapper.and",
        "ISNULL",
        "DEFINEDMACRO",
        "DEFINED",
        "CONTINUE",
        "CHECKMACRO",
        "bucketizer.or",
        "bucketizer.and",
        "BREAK",
        "AND",
        "&&",
        "!",
        "MAN",
        "UUID",
        "RTFM",
        "MAN",
        "RTFM",
        "INFOMODE",
        "INFO",
        "DOCMODE",
        "DOC",
        "ZSCORETEST",
        "ZDISCORDS",
        "THRESHOLDTEST",
        "STLESDTEST",
        "HYBRIDTEST2",
        "HYBRIDTEST",
        "GRUBBSTEST",
        "ESDTEST",
        "DISCORDS",
        "ZDTW",
        "RAWDTW",
        "OPTDTW",
        "DTW",
        "WRAPMV",
        "NEWENCODER",
        "MVELEVATIONS",
        "MVLOCATIONS",
        "MVHHCODES",
        "MVVALUES",
        "MVTICKS",
        "MVTICKSPLIT",
        "MVINDEXSPLIT",
        "->MVSTRING",
        "->GTS",
        "w",
        "us",
        "TSELEMENTS",
        "TOTIMESTAMP",
        "STU",
        "s",
        "ps",
        "ns",
        "NOW",
        "NOTBEFORE",
        "NOTAFTER",
        "MSTU",
        "ms",
        "m",
        "TSELEMENTS->",
        "ISO8601",
        "HUMANDURATION",
        "h",
        "d",
        "->TSELEMENTS",
        "AGO",
        "ADDYEARS",
        "ADDMONTHS",
        "ADDDURATION",
        "ADDDAYS",
        "VALUELIST",
        "UNMAP",
        "}",
        "{}",
        "{",
        "SUBMAP",
        "SIZE",
        "REMOVE",
        "PUT",
        "MSORT",
        "MAPID",
        "KEYLIST",
        "IMMUTABLE",
        "MAP->",
        "GET",
        "CONTAINSVALUE",
        "CONTAINSKEY",
        "CLONE",
        "APPEND",
        "->MAP",
        "~=",
        "~",
        "||",
        "|",
        "SIGNUM",
        "OR",
        "^",
        "LOG10",
        "LOG",
        "IEEEREMAINDER",
        ">>>",
        ">>",
        ">=",
        ">",
        "==",
        "<=",
        "<<",
        "<",
        "AND",
        "/",
        "-",
        "**",
        "*",
        "+!",
        "+",
        "&&",
        "&",
        "%",
        "!=",
        "!",
        "UNSECURE",
        "SHA256HMAC",
        "SHA256",
        "SHA1HMAC",
        "SHA1",
        "SECUREKEY",
        "SECURE",
        "RSAVERIFY",
        "RSASIGN",
        "RSAPUBLIC",
        "RSAPRIVATE",
        "RSAGEN",
        "RSAENCRYPT",
        "RSADECRYPT",
        "MD5",
        "EVALSECURE",
        "AESWRAP",
        "AESUNWRAP",
        "UNION",
        "SET->",
        "INTERSECTION",
        "IMMUTABLE",
        "DIFFERENCE",
        "->SET",
        ")",
        "()",
        "(",
        "TSELEMENTS",
        "STU",
        "NOW",
        "MSTU",
        "TSELEMENTS->",
        "ISODURATION",
        "ISO8601",
        "HUMANDURATION",
        "DURATION",
        "->TSELEMENTS",
        "TANH",
        "TAN",
        "SINH",
        "SIN",
        "HYPOT",
        "COSH",
        "COS",
        "ATAN2",
        "ATAN",
        "ASIN",
        "ACOS",
        "STL",
        "MAXBUCKETS",
        "MACROBUCKETIZER",
        "LASTBUCKET",
        "INTERPOLATE",
        "FILLVALUE",
        "FILLPREVIOUS",
        "FILLNEXT",
        "CROP",
        "BUCKETSPAN",
        "BUCKETIZE",
        "BUCKETCOUNT",
        "ATBUCKET",
        "SRANDPDF",
        "SKEWNESS",
        "SINGLEEXPONENTIALSMOOTHING",
        "RANDPDF",
        "PROBABILITY",
        "PROB",
        "LR",
        "KURTOSIS",
        "DOUBLEEXPONENTIALSMOOTHING",
        "ROTATIONQ",
        "QROTATION",
        "QROTATE",
        "QMULTIPLY",
        "QDIVIDE",
        "QCONJUGATE",
        "Q->",
        "->Q",
        "REDUCE",
        "PREDUCE",
        "PFILTER",
        "PAPPLY",
        "max.time.sliding.window",
        "max.tick.sliding.window",
        "MAP",
        "FILTER",
        "BUCKETIZE",
        "APPLY",
        "PIGSCHEMA",
        "]]",
        "[[",
        "V->",
        "->V",
        "PAPPLY",
        "op.sub",
        "op.or",
        "op.or.ignore-nulls",
        "op.negmask",
        "op.ne",
        "op.mul",
        "op.mul.ignore-nulls",
        "op.mask",
        "op.lt",
        "op.le",
        "op.gt",
        "op.ge",
        "op.eq",
        "op.div",
        "op.and",
        "op.and.ignore-nulls",
        "op.add",
        "op.add.ignore-nulls",
        "APPLY",
        "BYTESTOBITS",
        "BITSTOBYTES",
        "BITGET",
        "BITCOUNT"
    ],
    "constants": [
        "F",
        "T",
        "pi",
        "e",
        "NULL",
        "NaN",
        "MINLONG",
        "MAXLONG",
        "PI",
        "E"
    ],
    "functions": [
        "filter.byselector",
        "PFILTER",
        "MACROFILTER",
        "FILTER",
        "filter.bysize",
        "filter.latencies",
        "filter.last.ne",
        "filter.last.lt",
        "filter.last.le",
        "filter.last.gt",
        "filter.last.ge",
        "filter.last.eq",
        "filter.bymetadata",
        "filter.bylabelsattr",
        "filter.bylabels",
        "filter.byclass",
        "filter.byattr",
        "filter.any.ne",
        "filter.any.lt",
        "filter.any.le",
        "filter.any.gt",
        "filter.any.ge",
        "filter.any.eq",
        "filter.all.ne",
        "filter.all.lt",
        "filter.all.le",
        "filter.all.gt",
        "filter.all.ge",
        "filter.all.eq",
        "mapper.ne.tick",
        "mapper.ne.lon",
        "mapper.ne.lat",
        "mapper.ne.hhcode",
        "mapper.ne.elev",
        "mapper.lt.tick",
        "mapper.lt.lon",
        "mapper.lt.lat",
        "mapper.lt.hhcode",
        "mapper.lt.elev",
        "mapper.le.tick",
        "mapper.le.lon",
        "mapper.le.lat",
        "mapper.le.hhcode",
        "mapper.le.elev",
        "mapper.gt.tick",
        "mapper.gt.lon",
        "mapper.gt.lat",
        "mapper.gt.hhcode",
        "mapper.gt.elev",
        "mapper.ge.tick",
        "mapper.ge.lon",
        "mapper.ge.lat",
        "mapper.ge.hhcode",
        "mapper.ge.elev",
        "mapper.eq.tick",
        "mapper.eq.lon",
        "mapper.eq.lat",
        "mapper.eq.hhcode",
        "mapper.eq.elev",
        "mapper.rms",
        "STRICTMAPPER",
        "max.time.sliding.window",
        "max.tick.sliding.window",
        "mapper.year",
        "mapper.weekday",
        "mapper.vspeed",
        "mapper.vdist",
        "mapper.var",
        "mapper.var.forbid-nulls",
        "mapper.truecourse",
        "mapper.tostring",
        "mapper.tolong",
        "mapper.todouble",
        "mapper.toboolean",
        "mapper.tick",
        "mapper.tanh",
        "mapper.sum",
        "mapper.sum.forbid-nulls",
        "mapper.sqrt",
        "mapper.sigmoid",
        "mapper.second",
        "mapper.sd",
        "mapper.sd.forbid-nulls",
        "mapper.round",
        "mapper.replace",
        "mapper.rate",
        "mapper.product",
        "mapper.pow",
        "mapper.percentile",
        "mapper.parsedouble",
        "mapper.or",
        "mapper.npdf",
        "mapper.ne",
        "mapper.mul",
        "mapper.month",
        "mapper.mod",
        "mapper.minute",
        "mapper.min",
        "mapper.min.x",
        "mapper.min.forbid-nulls",
        "mapper.median.forbid-nulls",
        "mapper.median",
        "mapper.mean",
        "mapper.mean.exclude-nulls",
        "mapper.mean.circular",
        "mapper.mean.circular.exclude-nulls",
        "mapper.max",
        "mapper.max.x",
        "mapper.max.forbid-nulls",
        "mapper.mad",
        "mapper.lt",
        "mapper.lowest",
        "mapper.log",
        "mapper.le",
        "mapper.last",
        "mapper.kernel.uniform",
        "mapper.kernel.triweight",
        "mapper.kernel.tricube",
        "mapper.kernel.triangular",
        "mapper.kernel.silverman",
        "mapper.kernel.quartic",
        "mapper.kernel.logistic",
        "mapper.kernel.gaussian",
        "mapper.kernel.epanechnikov",
        "mapper.kernel.cosine",
        "mapper.join",
        "mapper.join.forbid-nulls",
        "mapper.hspeed",
        "mapper.hour",
        "mapper.highest",
        "mapper.hdist",
        "mapper.gt",
        "mapper.geo.within",
        "mapper.geo.outside",
        "mapper.geo.clear",
        "mapper.geo.approximate",
        "mapper.ge",
        "mapper.floor",
        "mapper.first",
        "mapper.finite",
        "mapper.exp",
        "mapper.eq",
        "mapper.dotproduct",
        "mapper.dotproduct.tanh",
        "mapper.dotproduct.sigmoid",
        "mapper.dotproduct.positive",
        "mapper.delta",
        "mapper.day",
        "mapper.count",
        "mapper.count.nonnull",
        "mapper.count.include-nulls",
        "mapper.count.exclude-nulls",
        "mapper.ceil",
        "mapper.and",
        "mapper.add",
        "mapper.abs",
        "MAP",
        "MACROMAPPER",
        "reducer.rms.exclude-nulls",
        "reducer.rms",
        "STRICTREDUCER",
        "reducer.var",
        "reducer.var.forbid-nulls",
        "reducer.sum",
        "reducer.sum.nonnull",
        "reducer.sum.forbid-nulls",
        "reducer.shannonentropy.1",
        "reducer.shannonentropy.0",
        "reducer.sd",
        "reducer.sd.forbid-nulls",
        "reducer.product",
        "reducer.percentile",
        "reducer.or",
        "reducer.or.exclude-nulls",
        "reducer.min",
        "reducer.min.nonnull",
        "reducer.min.forbid-nulls",
        "reducer.median.forbid-nulls",
        "reducer.median",
        "reducer.mean",
        "reducer.mean.exclude-nulls",
        "reducer.mean.circular",
        "reducer.mean.circular.exclude-nulls",
        "reducer.max",
        "reducer.max.nonnull",
        "reducer.max.forbid-nulls",
        "reducer.mad",
        "reducer.join",
        "reducer.join.urlencoded",
        "reducer.join.nonnull",
        "reducer.join.forbid-nulls",
        "reducer.count",
        "reducer.count.nonnull",
        "reducer.count.include-nulls",
        "reducer.count.exclude-nulls",
        "reducer.argmin",
        "reducer.argmax",
        "reducer.and",
        "reducer.and.exclude-nulls",
        "REDUCE",
        "PREDUCE",
        "MACROREDUCER",
        "bucketizer.rms",
        "MACROBUCKETIZER",
        "bucketizer.sum",
        "bucketizer.sum.forbid-nulls",
        "bucketizer.sd.forbid-nulls",
        "bucketizer.sd",
        "bucketizer.percentile",
        "bucketizer.or",
        "bucketizer.min",
        "bucketizer.min.forbid-nulls",
        "bucketizer.median.forbid-nulls",
        "bucketizer.median",
        "bucketizer.mean",
        "bucketizer.mean.exclude-nulls",
        "bucketizer.mean.circular",
        "bucketizer.mean.circular.exclude-nulls",
        "bucketizer.max",
        "bucketizer.max.forbid-nulls",
        "bucketizer.mad",
        "bucketizer.last",
        "bucketizer.join",
        "bucketizer.join.forbid-nulls",
        "bucketizer.first",
        "bucketizer.count",
        "bucketizer.count.nonnull",
        "bucketizer.count.include-nulls",
        "bucketizer.count.exclude-nulls",
        "bucketizer.and",
        "BUCKETIZE"
    ],
    "control": [
        "WHILE",
        "UNTIL",
        "UDF",
        "TRY",
        "SWITCH",
        "RETURN",
        "RETHROW",
        "NRETURN",
        "MSGFAIL",
        "IFTE",
        "IFT",
        "FORSTEP",
        "FOREACH",
        "FOR",
        "FAIL",
        "EVAL",
        "DEFINEDMACRO",
        "DEFINED",
        "CUDF",
        "CONTINUE",
        "CHECKMACRO",
        "BREAK"
    ],
    "operators": [
        "&",
        "^",
        "|",
        ">>>",
        "~",
        "<<",
        ">>",
        "!=",
        "<",
        ">",
        "~=",
        "<=",
        "==",
        ">=",
        "%",
        "*",
        "+",
        "-",
        "/",
        "**",
        "!",
        "&&",
        "AND",
        "OR",
        "NOT",
        "&",
        "^",
        "|",
        ">>>",
        "~",
        "<<",
        ">>"
    ],
    "escapes": "\\\\(?:[abfnrtv\\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})",
    "tokenizer": {
        "root": [
            [
                "\\@[A-Za-z0-9._\\/]+",
                "variable"
            ],
            [
                "\\$[A-Za-z0-9._\\/]+",
                "variable"
            ],
            [
                "true|false",
                "number"
            ],
            [
                "[A-Za-z_][.\\w$]*",
                {
                    "cases": {
                        "@constants": "regexp",
                        "@keywords": "keyword",
                        "@functions": "type",
                        "@control": "metatag",
                        "@default": "identifier"
                    }
                }
            ],
            [
                "[{}()[\\]]",
                "@brackets"
            ],
            [
                "\\d*\\.\\d+([eE][-+]?\\d+)?[fFdD]?",
                "number.float"
            ],
            [
                "0[xX][0-9a-fA-F_]*[0-9a-fA-F][Ll]?",
                "number.hex"
            ],
            [
                "0[0-7_]*[0-7][Ll]?",
                "number.octal"
            ],
            [
                "0[bB][0-1_]*[0-1][Ll]?",
                "number.binary"
            ],
            [
                "\\d+[lL]?",
                "number"
            ],
            {
                "include": "@whitespace"
            },
            [
                "\"([^\"\\\\]|\\\\.)*$",
                "string.invalid"
            ],
            [
                "\"",
                "string",
                "@string"
            ],
            [
                "'([^'\\\\]|\\\\.)*$",
                "string.invalid"
            ],
            [
                "'",
                "string",
                "@string2"
            ],
            [
                "<'",
                "string",
                "@string3"
            ]
        ],
        "whitespace": [
            [
                "[ \\t\\r\\n]+",
                "white"
            ],
            [
                "\\/\\*",
                "comment",
                "@comment"
            ],
            [
                "\\/\\/.*$",
                "comment"
            ]
        ],
        "comment": [
            [
                "[^\\/*]+",
                "comment"
            ],
            [
                "\\/\\*",
                "comment.invalid"
            ],
            [
                "\\*/",
                "comment",
                "@pop"
            ],
            [
                "[\\/*]",
                "comment"
            ]
        ],
        "string": [
            [
                "[^\\\"]+",
                "string"
            ],
            [
                "@escapes",
                "string.escape"
            ],
            [
                "\\.",
                "string.escape.invalid"
            ],
            [
                "\"",
                "string",
                "@pop"
            ]
        ],
        "string2": [
            [
                "[^\\']+",
                "string"
            ],
            [
                "@escapes",
                "string.escape"
            ],
            [
                "\\.",
                "string.escape.invalid"
            ],
            [
                "'",
                "string",
                "@pop"
            ]
        ],
        "string3": [
            [
                "[^\\(<')]+",
                "string"
            ],
            [
                "'>",
                "string",
                "@pop"
            ]
        ]
    }
};
      }
