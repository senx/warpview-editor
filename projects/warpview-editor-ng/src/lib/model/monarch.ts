export class Monarch {
        public static rules:any =  {
    "keywords": [
        "!",
        "!=",
        "%",
        "&",
        "&&",
        "(",
        "()",
        ")",
        "*",
        "**",
        "+",
        "+!",
        "-",
        "->B58",
        "->B58C",
        "->B64",
        "->B64URL",
        "->BIN",
        "->BYTES",
        "->DOUBLEBITS",
        "->ENCODER",
        "->ENCODERS",
        "->FLOATBITS",
        "->GEOCELL",
        "->GEOHASH",
        "->GEOJSON",
        "->GEOSHAPE",
        "->GML",
        "->GTS",
        "->GTSHHCODE",
        "->GTSHHCODELONG",
        "->HEX",
        "->HHCODE",
        "->HHCODELONG",
        "->JSON",
        "->KML",
        "->LIST",
        "->LONGBYTES",
        "->MACRO",
        "->MAP",
        "->MAT",
        "->MVSTRING",
        "->OPB64",
        "->PICKLE",
        "->Q",
        "->RLP",
        "->SET",
        "->SSSS",
        "->TSELEMENTS",
        "->V",
        "->VARINT",
        "->VEC",
        "->WKB",
        "->WKT",
        "->Z",
        "/",
        "<",
        "<<",
        "<=",
        "==",
        ">",
        ">=",
        ">>",
        ">>>",
        "ABI->",
        "ABI.SIG",
        "ABS",
        "ACCEL.CACHE",
        "ACCEL.NOCACHE",
        "ACCEL.NOPERSIST",
        "ACCEL.PERSIST",
        "ACCEL.REPORT",
        "ACOS",
        "ADDDAYS",
        "ADDDURATION",
        "ADDEXACT",
        "ADDMONTHS",
        "ADDVALUE",
        "ADDYEARS",
        "AESUNWRAP",
        "AESWRAP",
        "AGO",
        "AND",
        "APPEND",
        "APPLY",
        "ASENCODERS",
        "ASIN",
        "ASREGS",
        "ASSERT",
        "ASSERTMSG",
        "ATAN",
        "ATAN2",
        "ATBUCKET",
        "ATINDEX",
        "ATTICK",
        "ATTRIBUTES",
        "AUTHENTICATE",
        "B58->",
        "B58C->",
        "B64->",
        "B64TOHEX",
        "B64URL->",
        "BBOX",
        "BIN->",
        "BINTOHEX",
        "BITCOUNT",
        "BITGET",
        "BITSTOBYTES",
        "BOOTSTRAP",
        "BREAK",
        "BUCKETCOUNT",
        "BUCKETIZE",
        "BUCKETIZE.CALENDAR",
        "BUCKETSPAN",
        "BYTES->",
        "BYTESTOBITS",
        "CALL",
        "CAPADD",
        "CAPCHECK",
        "CAPDEL",
        "CAPGET",
        "CBRT",
        "CEIL",
        "CELL->",
        "CELLCF",
        "CELLCQ",
        "CELLROW",
        "CELLTAGS",
        "CELLTS",
        "CELLVALUE",
        "CEVAL",
        "CHECKMACRO",
        "CHECKSHAPE",
        "CHRONOEND",
        "CHRONOSTART",
        "CHRONOSTATS",
        "CHUNK",
        "CHUNKENCODER",
        "CLEAR",
        "CLEARDEFS",
        "CLEARREGS",
        "CLEARSYMBOLS",
        "CLEARTOMARK",
        "CLIP",
        "CLONE",
        "CLONEEMPTY",
        "CLONEREVERSE",
        "COMMONTICKS",
        "COMPACT",
        "CONTAINS",
        "CONTAINSKEY",
        "CONTAINSVALUE",
        "CONTINUE",
        "COPYGEO",
        "COPYSIGN",
        "CORRELATE",
        "COS",
        "COSH",
        "COUNTER",
        "COUNTERDELTA",
        "COUNTERSET",
        "COUNTERVALUE",
        "COUNTTOMARK",
        "CPOPR",
        "CPROB",
        "CROP",
        "CSTORE",
        "DEBUGOFF",
        "DEBUGON",
        "DECREMENTEXACT",
        "DEDUP",
        "DEF",
        "DEFINED",
        "DEFINEDMACRO",
        "DEFLATE",
        "DELETE",
        "DELETEOFF",
        "DELETEON",
        "DEPTH",
        "DEREF",
        "DET",
        "DIFFERENCE",
        "DISCORDS",
        "DOC",
        "DOCMODE",
        "DOUBLEBITS->",
        "DOUBLEEXPONENTIALSMOOTHING",
        "DROP",
        "DROPN",
        "DTW",
        "DUP",
        "DUPN",
        "DURATION",
        "DWTSPLIT",
        "E",
        "ECDH",
        "ECGEN",
        "ECHOOFF",
        "ECHOON",
        "ECPRIVATE",
        "ECPUBLIC",
        "ECRECOVER",
        "ECSIGN",
        "ECVERIFY",
        "EIP712.HASH",
        "ELAPSED",
        "ELEVATIONS",
        "EMPTY",
        "ENCODER->",
        "ERROR",
        "ESDTEST",
        "ETH.BIP32",
        "ETH.BIP39",
        "ETH.CALL",
        "ETH.KEY",
        "ETH.LOG",
        "ETH.NONCE",
        "ETH.RECEIPT",
        "ETH.RETURN",
        "ETH.TXN",
        "ETH.VERIFY",
        "EVALSECURE",
        "EVERY",
        "EXP",
        "EXPM1",
        "EXPORT",
        "EXTLOADED",
        "F",
        "FDWT",
        "FETCH",
        "FETCHBOOLEAN",
        "FETCHDOUBLE",
        "FETCHLONG",
        "FETCHSTRING",
        "FFT",
        "FFTAP",
        "FFTWINDOW",
        "FILL",
        "FILLNEXT",
        "FILLPREVIOUS",
        "FILLTICKS",
        "FILLVALUE",
        "FILTER",
        "FILTERBY",
        "FIND",
        "FINDSETS",
        "FINDSTATS",
        "FIRSTTICK",
        "FLATTEN",
        "FLOAD",
        "FLOATBITS->",
        "FLOOR",
        "FLOORDIV",
        "FLOORMOD",
        "FORGET",
        "FREAD",
        "FROMBIN",
        "FROMBITS",
        "FROMHEX",
        "FSTORE",
        "FUNCREF",
        "FUNCTIONS",
        "FUSE",
        "GEO.BUFFER",
        "GEO.COVER",
        "GEO.COVER.RL",
        "GEO.DIFFERENCE",
        "GEO.GML",
        "GEO.GML.UNIFORM",
        "GEO.INTERSECTION",
        "GEO.INTERSECTS",
        "GEO.JSON",
        "GEO.JSON.UNIFORM",
        "GEO.KML",
        "GEO.KML.UNIFORM",
        "GEO.NORMALIZE",
        "GEO.OPTIMIZE",
        "GEO.REGEXP",
        "GEO.UNION",
        "GEO.WITHIN",
        "GEO.WKB",
        "GEO.WKB.UNIFORM",
        "GEO.WKT",
        "GEO.WKT.UNIFORM",
        "GEOCELL->",
        "GEOHASH->",
        "GEOPACK",
        "GEOSHAPE->",
        "GEOSHIFT",
        "GEOSPLIT",
        "GEOUNPACK",
        "GET",
        "GETEXPONENT",
        "GETHOOK",
        "GETSECTION",
        "GITFIND",
        "GITLOAD",
        "GITLOG",
        "GITRM",
        "GITSTORE",
        "GITTAG",
        "GOLDWRAP",
        "GOST",
        "GROUPBY",
        "GRUBBSTEST",
        "GTSHHCODE->",
        "GUARD",
        "GZIP",
        "HASH",
        "HAVERSINE",
        "HEADER",
        "HEX->",
        "HEXTOB64",
        "HEXTOBIN",
        "HFCAT",
        "HFCLOSE",
        "HFDUMP",
        "HFFETCH",
        "HFID",
        "HFINDEX",
        "HFINFO",
        "HFKEYS",
        "HFOPEN",
        "HFRESCAN",
        "HFTOKEN",
        "HHCODE->",
        "HHCODE.BBOX",
        "HHCODE.CENTER",
        "HHCODE.EAST",
        "HHCODE.NORTH",
        "HHCODE.NORTH.EAST",
        "HHCODE.NORTH.WEST",
        "HHCODE.SOUTH",
        "HHCODE.SOUTH.EAST",
        "HHCODE.SOUTH.WEST",
        "HHCODE.WEST",
        "HIDE",
        "HLOCATE",
        "HTTP",
        "HULLSHAPE",
        "HUMANDURATION",
        "HYBRIDTEST",
        "HYBRIDTEST2",
        "HYPOT",
        "IDENT",
        "IDWT",
        "IEEEREMAINDER",
        "IFFT",
        "IMMUTABLE",
        "IMPORT",
        "INCREMENTEXACT",
        "INDEXOF",
        "INFLATE",
        "INFO",
        "INFOMODE",
        "INTEGRATE",
        "INTERPOLATE",
        "INTERSECTION",
        "INV",
        "ISAUTHENTICATED",
        "ISNULL",
        "ISNaN",
        "ISO8601",
        "ISODURATION",
        "ISONORMALIZE",
        "JOIN",
        "JSON->",
        "JSONCOMPACT",
        "JSONLOOSE",
        "JSONPRETTY",
        "JSONSTACK",
        "JSONSTRICT",
        "KECCAK.128",
        "KECCAK.224",
        "KECCAK.256",
        "KECCAK.288",
        "KECCAK.384",
        "KECCAK.512",
        "KEYLIST",
        "KURTOSIS",
        "LABELS",
        "LASTACTIVITY",
        "LASTBUCKET",
        "LASTSORT",
        "LASTTICK",
        "LBOUNDS",
        "LEVELDBCLOSE",
        "LEVELDBOPEN",
        "LEVELDBSECRET",
        "LEVELDBSNAPSHOT",
        "LEVELDBSNAPSHOTINC",
        "LFILTER",
        "LFLATMAP",
        "LIMIT",
        "LINEOFF",
        "LINEON",
        "LIST->",
        "LMAP",
        "LOAD",
        "LOCATIONOFFSET",
        "LOCATIONS",
        "LOCSTRINGS",
        "LOG",
        "LOG10",
        "LOG1P",
        "LOGEVENT->",
        "LOGMSG",
        "LOWESS",
        "LR",
        "LSORT",
        "LTTB",
        "MACRO->",
        "MACROBUCKETIZER",
        "MACROCONFIG",
        "MACROCONFIGDEFAULT",
        "MACROCONFIGSECRET",
        "MACROFILLER",
        "MACROTTL",
        "MAKEGTS",
        "MAN",
        "MAP",
        "MAP->",
        "MAPID",
        "MARK",
        "MAT->",
        "MATCH",
        "MATCHER",
        "MAX",
        "MAXBUCKETS",
        "MAXDEPTH",
        "MAXGEOCELLS",
        "MAXGTS",
        "MAXJSON",
        "MAXLONG",
        "MAXLOOP",
        "MAXOPS",
        "MAXPIXELS",
        "MAXRECURSION",
        "MAXSYMBOLS",
        "MAXURLFETCHCOUNT",
        "MAXURLFETCHSIZE",
        "MCHECKSIG",
        "MD2",
        "MD4",
        "MD5",
        "MDETACH",
        "MERGE",
        "META",
        "METADIFF",
        "METAOFF",
        "METAON",
        "METASET",
        "METASORT",
        "MFILTER",
        "MIN",
        "MINLONG",
        "MINREV",
        "MMAP",
        "MODE",
        "MONOTONIC",
        "MOTIONSPLIT",
        "MRSEC",
        "MSEC",
        "MSIG",
        "MSIGCOUNT",
        "MSIGINFO",
        "MSIGN",
        "MSORT",
        "MSTU",
        "MULTIPLYEXACT",
        "MUSIGMA",
        "MUTEX",
        "MVELEVATIONS",
        "MVERIFY",
        "MVHHCODES",
        "MVINDEXSPLIT",
        "MVLOCATIONS",
        "MVTICKS",
        "MVTICKSPLIT",
        "MVVALUES",
        "NAME",
        "NBOUNDS",
        "NDEBUGON",
        "NEGATEEXACT",
        "NEWENCODER",
        "NEWGTS",
        "NEXTAFTER",
        "NEXTDOWN",
        "NEXTUP",
        "NOLOG",
        "NONEMPTY",
        "NONNULL",
        "NOOP",
        "NORMALIZE",
        "NOT",
        "NOTAFTER",
        "NOTBEFORE",
        "NOTIMINGS",
        "NOW",
        "NPDF",
        "NPEEK",
        "NSUMSUMSQ",
        "ONLYBUCKETS",
        "OPB64->",
        "OPB64TOHEX",
        "OPS",
        "OPTDTW",
        "OPTIMIZE",
        "OR",
        "PACK",
        "PAPPLY",
        "PARSE",
        "PARSESELECTOR",
        "PARSEVALUE",
        "PARTITION",
        "PATTERNDETECTION",
        "PATTERNS",
        "PEEK",
        "PEEKN",
        "PERMUTE",
        "PFILTER",
        "PGPDECRYPT",
        "PGPENCRYPT",
        "PGPINFO",
        "PGPPRIVATE",
        "PGPPUBLIC",
        "PGPRING",
        "PGPSIGN",
        "PGPVERIFY",
        "PGraphics",
        "PI",
        "PICK",
        "PICKLE->",
        "PIGSCHEMA",
        "PIVOT",
        "PIVOTSTRICT",
        "POLYFIT",
        "POLYFUNC",
        "POPR",
        "PREDUCE",
        "PRNG",
        "PROB",
        "PROBABILITY",
        "PSTACK",
        "PUSHR",
        "PUT",
        "Palpha",
        "Parc",
        "Pbackground",
        "PbeginContour",
        "PbeginShape",
        "Pbezier",
        "PbezierDetail",
        "PbezierPoint",
        "PbezierTangent",
        "PbezierVertex",
        "Pblend",
        "PblendMode",
        "Pblue",
        "Pbox",
        "Pbrightness",
        "Pclear",
        "Pclip",
        "Pcolor",
        "PcolorMode",
        "Pconstrain",
        "Pcopy",
        "PcreateFont",
        "Pcurve",
        "PcurveDetail",
        "PcurvePoint",
        "PcurveTangent",
        "PcurveTightness",
        "PcurveVertex",
        "Pdecode",
        "Pdist",
        "Pellipse",
        "PellipseMode",
        "Pencode",
        "PendContour",
        "PendShape",
        "Pfill",
        "Pfilter",
        "Pget",
        "Pgreen",
        "Phue",
        "Pimage",
        "PimageMode",
        "Plerp",
        "PlerpColor",
        "Pline",
        "PloadShape",
        "Pmag",
        "Pmap",
        "Pmask",
        "PnoClip",
        "PnoFill",
        "PnoStroke",
        "PnoTint",
        "Pnorm",
        "Ppixels",
        "Ppoint",
        "PpopMatrix",
        "PpopStyle",
        "PpushMatrix",
        "PpushStyle",
        "Pquad",
        "PquadraticVertex",
        "Prect",
        "PrectMode",
        "Pred",
        "PresetMatrix",
        "Presize",
        "Protate",
        "Psaturation",
        "Pscale",
        "Pset",
        "Pshape",
        "PshapeMode",
        "PshearX",
        "PshearY",
        "Psize",
        "Psphere",
        "PsphereDetail",
        "Pstroke",
        "PstrokeCap",
        "PstrokeJoin",
        "PstrokeWeight",
        "Ptext",
        "PtextAlign",
        "PtextAscent",
        "PtextDescent",
        "PtextFont",
        "PtextLeading",
        "PtextMode",
        "PtextSize",
        "PtextWidth",
        "Ptint",
        "PtoImage",
        "Ptranslate",
        "Ptriangle",
        "PupdatePixels",
        "Pvertex",
        "Q->",
        "QCONJUGATE",
        "QDIVIDE",
        "QMULTIPLY",
        "QROTATE",
        "QROTATION",
        "QUANTIZE",
        "RAND",
        "RANDOM",
        "RANDPDF",
        "RANGE",
        "RANGECOMPACT",
        "RAWDTW",
        "REDEFS",
        "REDUCE",
        "RELABEL",
        "REMOVE",
        "REMOVETICK",
        "RENAME",
        "REOPTALT",
        "REPLACE",
        "REPLACEALL",
        "REPORT",
        "RESET",
        "RESETS",
        "RESHAPE",
        "RESTORE",
        "REV",
        "REVBITS",
        "REVERSE",
        "REXEC",
        "REXECZ",
        "RINT",
        "RIPEMD128",
        "RIPEMD160",
        "RIPEMD256",
        "RIPEMD320",
        "RLOWESS",
        "RLP->",
        "ROLL",
        "ROLLD",
        "ROT",
        "ROTATIONQ",
        "ROUND",
        "RSADECRYPT",
        "RSAENCRYPT",
        "RSAGEN",
        "RSAPRIVATE",
        "RSAPUBLIC",
        "RSASIGN",
        "RSAVERIFY",
        "RSORT",
        "RTFM",
        "RUN",
        "RUNNERAT",
        "RUNNERIN",
        "RUNNERNONCE",
        "RUNR",
        "RVALUESORT",
        "SAVE",
        "SCALB",
        "SECTION",
        "SECURE",
        "SECUREKEY",
        "SENSISION.DUMP",
        "SENSISION.DUMPEVENTS",
        "SENSISION.EVENT",
        "SENSISION.GET",
        "SENSISION.SET",
        "SENSISION.UPDATE",
        "SET",
        "SET->",
        "SETATTRIBUTES",
        "SETMACROCONFIG",
        "SETVALUE",
        "SHA1",
        "SHA1HMAC",
        "SHA224",
        "SHA256",
        "SHA256HMAC",
        "SHA3.224",
        "SHA3.256",
        "SHA3.384",
        "SHA3.512",
        "SHA384",
        "SHA512",
        "SHAPE",
        "SHMDEFINED",
        "SHMLOAD",
        "SHMSTORE",
        "SHOW",
        "SHRINK",
        "SHUFFLE",
        "SIGNUM",
        "SIN",
        "SINGLEEXPONENTIALSMOOTHING",
        "SINH",
        "SIZE",
        "SKEWNESS",
        "SMARTPARSE",
        "SNAPSHOT",
        "SNAPSHOTALL",
        "SNAPSHOTALLTOMARK",
        "SNAPSHOTCOPY",
        "SNAPSHOTCOPYALL",
        "SNAPSHOTCOPYALLTOMARK",
        "SNAPSHOTCOPYN",
        "SNAPSHOTCOPYTOMARK",
        "SNAPSHOTN",
        "SNAPSHOTREADABLE",
        "SNAPSHOTTOMARK",
        "SORT",
        "SORTBY",
        "SORTWITH",
        "SPLIT",
        "SQRT",
        "SRAND",
        "SRANDPDF",
        "SSSS->",
        "SSTFIND",
        "SSTINFO",
        "SSTPURGE",
        "SSTREPORT",
        "SSTTIMESTAMP",
        "STACKATTRIBUTE",
        "STACKPSSECRET",
        "STACKTOLIST",
        "STANDARDIZE",
        "STDERR",
        "STDIN",
        "STDOUT",
        "STL",
        "STLESDTEST",
        "STOP",
        "STORE",
        "STRICTPARTITION",
        "STRINGFORMAT",
        "STU",
        "SUBLIST",
        "SUBMAP",
        "SUBSTRING",
        "SUBTRACTEXACT",
        "SWAP",
        "SYMBOLS",
        "SYNC",
        "T",
        "TAN",
        "TANH",
        "TDESCRIBE",
        "TEMPLATE",
        "THRESHOLDTEST",
        "TICKINDEX",
        "TICKLIST",
        "TICKS",
        "TIGER",
        "TIMEBOX",
        "TIMECLIP",
        "TIMED",
        "TIMEMODULO",
        "TIMEOFF",
        "TIMEON",
        "TIMESCALE",
        "TIMESHIFT",
        "TIMESPLIT",
        "TIMINGS",
        "TLTTB",
        "TOBIN",
        "TOBITS",
        "TOBOOLEAN",
        "TODEGREES",
        "TODOUBLE",
        "TOHEX",
        "TOINTEXACT",
        "TOKENDUMP",
        "TOKENGEN",
        "TOKENINFO",
        "TOKENSECRET",
        "TOLONG",
        "TOLOWER",
        "TORADIANS",
        "TOSELECTOR",
        "TOSTRING",
        "TOTIMESTAMP",
        "TOUPPER",
        "TR",
        "TRANSPOSE",
        "TRIM",
        "TSELEMENTS",
        "TSELEMENTS->",
        "TYPEOF",
        "ULP",
        "UNBUCKETIZE",
        "UNBUCKETIZE.CALENDAR",
        "UNGZIP",
        "UNION",
        "UNIQUE",
        "UNLIST",
        "UNMAP",
        "UNPACK",
        "UNSECURE",
        "UNSET",
        "UNWRAP",
        "UNWRAPEMPTY",
        "UNWRAPENCODER",
        "UNWRAPSIZE",
        "UPDATE",
        "UPDATEOFF",
        "UPDATEON",
        "URLDECODE",
        "URLENCODE",
        "URLFETCH",
        "UUID",
        "V->",
        "VALUEDEDUP",
        "VALUEHISTOGRAM",
        "VALUELIST",
        "VALUES",
        "VALUESORT",
        "VALUESPLIT",
        "VARINT->",
        "VARS",
        "VEC->",
        "WEBCALL",
        "WF.ADDREPO",
        "WF.GETREPOS",
        "WF.SETREPOS",
        "WFOFF",
        "WFON",
        "WHIRLPOOL",
        "WRAP",
        "WRAPFAST",
        "WRAPMV",
        "WRAPMV!",
        "WRAPOPT",
        "WRAPRAW",
        "WRAPRAWOPT",
        "WSINFO",
        "WSKILL",
        "WSKILLSESSION",
        "WSNAME",
        "WSPS",
        "WSSESSION",
        "WSSTACK",
        "WSSTOP",
        "WSSTOPSESSION",
        "Z->",
        "ZDISCORDS",
        "ZDTW",
        "ZIP",
        "ZPATTERNDETECTION",
        "ZPATTERNS",
        "ZSCORE",
        "ZSCORETEST",
        "[",
        "[[",
        "[[]]",
        "[]",
        "]",
        "]]",
        "^",
        "babbage",
        "bucketizer.and",
        "bucketizer.or",
        "buterin",
        "d",
        "e",
        "eth",
        "ether",
        "filler.interpolate",
        "filler.next",
        "filler.previous",
        "filler.trend",
        "filter.latencies",
        "finney",
        "gwei",
        "h",
        "kwei",
        "lovelace",
        "m",
        "mapper.and",
        "mapper.finite",
        "mapper.geo.approximate",
        "mapper.geo.clear",
        "mapper.geo.fence",
        "mapper.geo.outside",
        "mapper.geo.within",
        "mapper.hdist",
        "mapper.median",
        "mapper.median.forbid-nulls",
        "mapper.mod",
        "mapper.npdf",
        "mapper.or",
        "mapper.percentile",
        "mapper.percentile.forbid-nulls",
        "mapper.truecourse",
        "max.tick.sliding.window",
        "max.time.sliding.window",
        "ms",
        "mwei",
        "ns",
        "op.add",
        "op.add.ignore-nulls",
        "op.and",
        "op.and.ignore-nulls",
        "op.div",
        "op.eq",
        "op.ge",
        "op.gt",
        "op.le",
        "op.lt",
        "op.mask",
        "op.mul",
        "op.mul.ignore-nulls",
        "op.ne",
        "op.negmask",
        "op.or",
        "op.or.ignore-nulls",
        "op.sub",
        "pi",
        "ps",
        "pwei",
        "reducer.and",
        "reducer.and.exclude-nulls",
        "s",
        "shannon",
        "szabo",
        "twei",
        "us",
        "w",
        "wei",
        "{",
        "{}",
        "|",
        "||",
        "}",
        "~",
        "~="
    ],
    "constants": [
        "E",
        "F",
        "MAXLONG",
        "MINLONG",
        "NULL",
        "NaN",
        "PI",
        "T",
        "e",
        "pi"
    ],
    "functions": [
        "BUCKETIZE",
        "BUCKETIZE.CALENDAR",
        "FILTER",
        "MACROBUCKETIZER",
        "MACROFILTER",
        "MACROMAPPER",
        "MACROREDUCER",
        "MAP",
        "METAMATCH",
        "PFILTER",
        "PREDUCE",
        "REDUCE",
        "STRICTMAPPER",
        "STRICTREDUCER",
        "UNBUCKETIZE.CALENDAR",
        "bucketizer.and",
        "bucketizer.count",
        "bucketizer.count.exclude-nulls",
        "bucketizer.count.include-nulls",
        "bucketizer.count.nonnull",
        "bucketizer.first",
        "bucketizer.join",
        "bucketizer.join.forbid-nulls",
        "bucketizer.last",
        "bucketizer.mad",
        "bucketizer.max",
        "bucketizer.max.forbid-nulls",
        "bucketizer.mean",
        "bucketizer.mean.circular",
        "bucketizer.mean.circular.exclude-nulls",
        "bucketizer.mean.exclude-nulls",
        "bucketizer.median",
        "bucketizer.median.forbid-nulls",
        "bucketizer.min",
        "bucketizer.min.forbid-nulls",
        "bucketizer.or",
        "bucketizer.percentile",
        "bucketizer.percentile.forbid-nulls",
        "bucketizer.rms",
        "bucketizer.sd",
        "bucketizer.sd.forbid-nulls",
        "bucketizer.sd.welford",
        "bucketizer.sum",
        "bucketizer.sum.forbid-nulls",
        "bucketizer.var",
        "bucketizer.var.welford",
        "filter.all.eq",
        "filter.all.ge",
        "filter.all.gt",
        "filter.all.le",
        "filter.all.lt",
        "filter.all.ne",
        "filter.any.eq",
        "filter.any.ge",
        "filter.any.gt",
        "filter.any.le",
        "filter.any.lt",
        "filter.any.ne",
        "filter.byattr",
        "filter.byclass",
        "filter.bylabels",
        "filter.bylabelsattr",
        "filter.bymetadata",
        "filter.byselector",
        "filter.bysize",
        "filter.last.eq",
        "filter.last.ge",
        "filter.last.gt",
        "filter.last.le",
        "filter.last.lt",
        "filter.last.ne",
        "filter.latencies",
        "mapper.abs",
        "mapper.add",
        "mapper.and",
        "mapper.ceil",
        "mapper.count",
        "mapper.count.exclude-nulls",
        "mapper.count.include-nulls",
        "mapper.count.nonnull",
        "mapper.day",
        "mapper.delta",
        "mapper.dotproduct",
        "mapper.dotproduct.positive",
        "mapper.dotproduct.sigmoid",
        "mapper.dotproduct.tanh",
        "mapper.eq",
        "mapper.eq.elev",
        "mapper.eq.hhcode",
        "mapper.eq.lat",
        "mapper.eq.lon",
        "mapper.eq.tick",
        "mapper.exp",
        "mapper.finite",
        "mapper.first",
        "mapper.floor",
        "mapper.ge",
        "mapper.ge.elev",
        "mapper.ge.hhcode",
        "mapper.ge.lat",
        "mapper.ge.lon",
        "mapper.ge.tick",
        "mapper.geo.approximate",
        "mapper.geo.clear",
        "mapper.geo.fence",
        "mapper.geo.outside",
        "mapper.geo.within",
        "mapper.gt",
        "mapper.gt.elev",
        "mapper.gt.hhcode",
        "mapper.gt.lat",
        "mapper.gt.lon",
        "mapper.gt.tick",
        "mapper.hdist",
        "mapper.highest",
        "mapper.hour",
        "mapper.hspeed",
        "mapper.join",
        "mapper.join.forbid-nulls",
        "mapper.kernel.cosine",
        "mapper.kernel.epanechnikov",
        "mapper.kernel.gaussian",
        "mapper.kernel.logistic",
        "mapper.kernel.quartic",
        "mapper.kernel.silverman",
        "mapper.kernel.triangular",
        "mapper.kernel.tricube",
        "mapper.kernel.triweight",
        "mapper.kernel.uniform",
        "mapper.last",
        "mapper.le",
        "mapper.le.elev",
        "mapper.le.hhcode",
        "mapper.le.lat",
        "mapper.le.lon",
        "mapper.le.tick",
        "mapper.log",
        "mapper.lowest",
        "mapper.lt",
        "mapper.lt.elev",
        "mapper.lt.hhcode",
        "mapper.lt.lat",
        "mapper.lt.lon",
        "mapper.lt.tick",
        "mapper.mad",
        "mapper.max",
        "mapper.max.forbid-nulls",
        "mapper.max.x",
        "mapper.mean",
        "mapper.mean.circular",
        "mapper.mean.circular.exclude-nulls",
        "mapper.mean.exclude-nulls",
        "mapper.median",
        "mapper.median.forbid-nulls",
        "mapper.min",
        "mapper.min.forbid-nulls",
        "mapper.min.x",
        "mapper.minute",
        "mapper.mod",
        "mapper.month",
        "mapper.mul",
        "mapper.ne",
        "mapper.ne.elev",
        "mapper.ne.hhcode",
        "mapper.ne.lat",
        "mapper.ne.lon",
        "mapper.ne.tick",
        "mapper.npdf",
        "mapper.or",
        "mapper.parsedouble",
        "mapper.percentile",
        "mapper.percentile.forbid-nulls",
        "mapper.pow",
        "mapper.product",
        "mapper.rate",
        "mapper.replace",
        "mapper.rms",
        "mapper.round",
        "mapper.sd",
        "mapper.sd.forbid-nulls",
        "mapper.sd.welford",
        "mapper.second",
        "mapper.sigmoid",
        "mapper.sqrt",
        "mapper.sum",
        "mapper.sum.forbid-nulls",
        "mapper.tanh",
        "mapper.tick",
        "mapper.toboolean",
        "mapper.todouble",
        "mapper.tolong",
        "mapper.tostring",
        "mapper.truecourse",
        "mapper.var",
        "mapper.var.forbid-nulls",
        "mapper.var.welford",
        "mapper.vdist",
        "mapper.vspeed",
        "mapper.weekday",
        "mapper.year",
        "max.tick.sliding.window",
        "max.time.sliding.window",
        "reducer.and",
        "reducer.and.exclude-nulls",
        "reducer.argmax",
        "reducer.argmin",
        "reducer.count",
        "reducer.count.exclude-nulls",
        "reducer.count.include-nulls",
        "reducer.count.nonnull",
        "reducer.join",
        "reducer.join.forbid-nulls",
        "reducer.join.nonnull",
        "reducer.join.urlencoded",
        "reducer.mad",
        "reducer.max",
        "reducer.max.forbid-nulls",
        "reducer.max.nonnull",
        "reducer.mean",
        "reducer.mean.circular",
        "reducer.mean.circular.exclude-nulls",
        "reducer.mean.exclude-nulls",
        "reducer.median",
        "reducer.median.forbid-nulls",
        "reducer.min",
        "reducer.min.forbid-nulls",
        "reducer.min.nonnull",
        "reducer.or",
        "reducer.or.exclude-nulls",
        "reducer.percentile",
        "reducer.percentile.forbid-nulls",
        "reducer.product",
        "reducer.rms",
        "reducer.rms.exclude-nulls",
        "reducer.sd",
        "reducer.sd.forbid-nulls",
        "reducer.sd.welford",
        "reducer.sd.welford.forbid-nulls",
        "reducer.shannonentropy.0",
        "reducer.shannonentropy.1",
        "reducer.sum",
        "reducer.sum.forbid-nulls",
        "reducer.sum.nonnull",
        "reducer.var",
        "reducer.var.forbid-nulls",
        "reducer.var.welford",
        "reducer.var.welford.forbid-nulls"
    ],
    "control": [
        "BREAK",
        "CHECKMACRO",
        "CONTINUE",
        "CUDF",
        "DEFINED",
        "DEFINEDMACRO",
        "EVAL",
        "FAIL",
        "FOR",
        "FOREACH",
        "FORSTEP",
        "IFT",
        "IFTE",
        "MSGFAIL",
        "NRETURN",
        "RETHROW",
        "RETURN",
        "SWITCH",
        "TRY",
        "UDF",
        "UNTIL",
        "WHILE"
    ],
    "operators": [
        "!",
        "!=",
        "%",
        "&",
        "&&",
        "*",
        "**",
        "+",
        "+!",
        "-",
        "/",
        "<",
        "<<",
        "<=",
        "==",
        ">",
        ">=",
        ">>",
        ">>>",
        "AND",
        "NOT",
        "OR",
        "^",
        "|",
        "||",
        "~",
        "~="
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