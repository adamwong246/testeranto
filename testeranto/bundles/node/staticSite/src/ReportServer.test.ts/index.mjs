import { createRequire } from 'module';const require = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/mime/types.json
var require_types = __commonJS({
  "node_modules/mime/types.json"(exports, module) {
    module.exports = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomsvc+xml": ["atomsvc"], "application/bdoc": ["bdoc"], "application/ccxml+xml": ["ccxml"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["ecma"], "application/emma+xml": ["emma"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/font-tdpfr": ["pfr"], "application/font-woff": [], "application/font-woff2": [], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/patch-ops-error+xml": ["xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/prs.cww": ["cww"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/vnd.3gpp.pic-bw-large": ["plb"], "application/vnd.3gpp.pic-bw-small": ["psb"], "application/vnd.3gpp.pic-bw-var": ["pvb"], "application/vnd.3gpp2.tcap": ["tcap"], "application/vnd.3m.post-it-notes": ["pwn"], "application/vnd.accpac.simply.aso": ["aso"], "application/vnd.accpac.simply.imp": ["imp"], "application/vnd.acucobol": ["acu"], "application/vnd.acucorp": ["atc", "acutc"], "application/vnd.adobe.air-application-installer-package+zip": ["air"], "application/vnd.adobe.formscentral.fcdt": ["fcdt"], "application/vnd.adobe.fxp": ["fxp", "fxpl"], "application/vnd.adobe.xdp+xml": ["xdp"], "application/vnd.adobe.xfdf": ["xfdf"], "application/vnd.ahead.space": ["ahead"], "application/vnd.airzip.filesecure.azf": ["azf"], "application/vnd.airzip.filesecure.azs": ["azs"], "application/vnd.amazon.ebook": ["azw"], "application/vnd.americandynamics.acc": ["acc"], "application/vnd.amiga.ami": ["ami"], "application/vnd.android.package-archive": ["apk"], "application/vnd.anser-web-certificate-issue-initiation": ["cii"], "application/vnd.anser-web-funds-transfer-initiation": ["fti"], "application/vnd.antix.game-component": ["atx"], "application/vnd.apple.installer+xml": ["mpkg"], "application/vnd.apple.mpegurl": ["m3u8"], "application/vnd.apple.pkpass": ["pkpass"], "application/vnd.aristanetworks.swi": ["swi"], "application/vnd.astraea-software.iota": ["iota"], "application/vnd.audiograph": ["aep"], "application/vnd.blueice.multipass": ["mpm"], "application/vnd.bmi": ["bmi"], "application/vnd.businessobjects": ["rep"], "application/vnd.chemdraw+xml": ["cdxml"], "application/vnd.chipnuts.karaoke-mmd": ["mmd"], "application/vnd.cinderella": ["cdy"], "application/vnd.claymore": ["cla"], "application/vnd.cloanto.rp9": ["rp9"], "application/vnd.clonk.c4group": ["c4g", "c4d", "c4f", "c4p", "c4u"], "application/vnd.cluetrust.cartomobile-config": ["c11amc"], "application/vnd.cluetrust.cartomobile-config-pkg": ["c11amz"], "application/vnd.commonspace": ["csp"], "application/vnd.contact.cmsg": ["cdbcmsg"], "application/vnd.cosmocaller": ["cmc"], "application/vnd.crick.clicker": ["clkx"], "application/vnd.crick.clicker.keyboard": ["clkk"], "application/vnd.crick.clicker.palette": ["clkp"], "application/vnd.crick.clicker.template": ["clkt"], "application/vnd.crick.clicker.wordbank": ["clkw"], "application/vnd.criticaltools.wbs+xml": ["wbs"], "application/vnd.ctc-posml": ["pml"], "application/vnd.cups-ppd": ["ppd"], "application/vnd.curl.car": ["car"], "application/vnd.curl.pcurl": ["pcurl"], "application/vnd.dart": ["dart"], "application/vnd.data-vision.rdz": ["rdz"], "application/vnd.dece.data": ["uvf", "uvvf", "uvd", "uvvd"], "application/vnd.dece.ttml+xml": ["uvt", "uvvt"], "application/vnd.dece.unspecified": ["uvx", "uvvx"], "application/vnd.dece.zip": ["uvz", "uvvz"], "application/vnd.denovo.fcselayout-link": ["fe_launch"], "application/vnd.dna": ["dna"], "application/vnd.dolby.mlp": ["mlp"], "application/vnd.dpgraph": ["dpg"], "application/vnd.dreamfactory": ["dfac"], "application/vnd.ds-keypoint": ["kpxx"], "application/vnd.dvb.ait": ["ait"], "application/vnd.dvb.service": ["svc"], "application/vnd.dynageo": ["geo"], "application/vnd.ecowin.chart": ["mag"], "application/vnd.enliven": ["nml"], "application/vnd.epson.esf": ["esf"], "application/vnd.epson.msf": ["msf"], "application/vnd.epson.quickanime": ["qam"], "application/vnd.epson.salt": ["slt"], "application/vnd.epson.ssf": ["ssf"], "application/vnd.eszigno3+xml": ["es3", "et3"], "application/vnd.ezpix-album": ["ez2"], "application/vnd.ezpix-package": ["ez3"], "application/vnd.fdf": ["fdf"], "application/vnd.fdsn.mseed": ["mseed"], "application/vnd.fdsn.seed": ["seed", "dataless"], "application/vnd.flographit": ["gph"], "application/vnd.fluxtime.clip": ["ftc"], "application/vnd.framemaker": ["fm", "frame", "maker", "book"], "application/vnd.frogans.fnc": ["fnc"], "application/vnd.frogans.ltf": ["ltf"], "application/vnd.fsc.weblaunch": ["fsc"], "application/vnd.fujitsu.oasys": ["oas"], "application/vnd.fujitsu.oasys2": ["oa2"], "application/vnd.fujitsu.oasys3": ["oa3"], "application/vnd.fujitsu.oasysgp": ["fg5"], "application/vnd.fujitsu.oasysprs": ["bh2"], "application/vnd.fujixerox.ddd": ["ddd"], "application/vnd.fujixerox.docuworks": ["xdw"], "application/vnd.fujixerox.docuworks.binder": ["xbd"], "application/vnd.fuzzysheet": ["fzs"], "application/vnd.genomatix.tuxedo": ["txd"], "application/vnd.geogebra.file": ["ggb"], "application/vnd.geogebra.tool": ["ggt"], "application/vnd.geometry-explorer": ["gex", "gre"], "application/vnd.geonext": ["gxt"], "application/vnd.geoplan": ["g2w"], "application/vnd.geospace": ["g3w"], "application/vnd.gmx": ["gmx"], "application/vnd.google-apps.document": ["gdoc"], "application/vnd.google-apps.presentation": ["gslides"], "application/vnd.google-apps.spreadsheet": ["gsheet"], "application/vnd.google-earth.kml+xml": ["kml"], "application/vnd.google-earth.kmz": ["kmz"], "application/vnd.grafeq": ["gqf", "gqs"], "application/vnd.groove-account": ["gac"], "application/vnd.groove-help": ["ghf"], "application/vnd.groove-identity-message": ["gim"], "application/vnd.groove-injector": ["grv"], "application/vnd.groove-tool-message": ["gtm"], "application/vnd.groove-tool-template": ["tpl"], "application/vnd.groove-vcard": ["vcg"], "application/vnd.hal+xml": ["hal"], "application/vnd.handheld-entertainment+xml": ["zmm"], "application/vnd.hbci": ["hbci"], "application/vnd.hhe.lesson-player": ["les"], "application/vnd.hp-hpgl": ["hpgl"], "application/vnd.hp-hpid": ["hpid"], "application/vnd.hp-hps": ["hps"], "application/vnd.hp-jlyt": ["jlt"], "application/vnd.hp-pcl": ["pcl"], "application/vnd.hp-pclxl": ["pclxl"], "application/vnd.hydrostatix.sof-data": ["sfd-hdstx"], "application/vnd.ibm.minipay": ["mpy"], "application/vnd.ibm.modcap": ["afp", "listafp", "list3820"], "application/vnd.ibm.rights-management": ["irm"], "application/vnd.ibm.secure-container": ["sc"], "application/vnd.iccprofile": ["icc", "icm"], "application/vnd.igloader": ["igl"], "application/vnd.immervision-ivp": ["ivp"], "application/vnd.immervision-ivu": ["ivu"], "application/vnd.insors.igm": ["igm"], "application/vnd.intercon.formnet": ["xpw", "xpx"], "application/vnd.intergeo": ["i2g"], "application/vnd.intu.qbo": ["qbo"], "application/vnd.intu.qfx": ["qfx"], "application/vnd.ipunplugged.rcprofile": ["rcprofile"], "application/vnd.irepository.package+xml": ["irp"], "application/vnd.is-xpr": ["xpr"], "application/vnd.isac.fcs": ["fcs"], "application/vnd.jam": ["jam"], "application/vnd.jcp.javame.midlet-rms": ["rms"], "application/vnd.jisp": ["jisp"], "application/vnd.joost.joda-archive": ["joda"], "application/vnd.kahootz": ["ktz", "ktr"], "application/vnd.kde.karbon": ["karbon"], "application/vnd.kde.kchart": ["chrt"], "application/vnd.kde.kformula": ["kfo"], "application/vnd.kde.kivio": ["flw"], "application/vnd.kde.kontour": ["kon"], "application/vnd.kde.kpresenter": ["kpr", "kpt"], "application/vnd.kde.kspread": ["ksp"], "application/vnd.kde.kword": ["kwd", "kwt"], "application/vnd.kenameaapp": ["htke"], "application/vnd.kidspiration": ["kia"], "application/vnd.kinar": ["kne", "knp"], "application/vnd.koan": ["skp", "skd", "skt", "skm"], "application/vnd.kodak-descriptor": ["sse"], "application/vnd.las.las+xml": ["lasxml"], "application/vnd.llamagraphics.life-balance.desktop": ["lbd"], "application/vnd.llamagraphics.life-balance.exchange+xml": ["lbe"], "application/vnd.lotus-1-2-3": ["123"], "application/vnd.lotus-approach": ["apr"], "application/vnd.lotus-freelance": ["pre"], "application/vnd.lotus-notes": ["nsf"], "application/vnd.lotus-organizer": ["org"], "application/vnd.lotus-screencam": ["scm"], "application/vnd.lotus-wordpro": ["lwp"], "application/vnd.macports.portpkg": ["portpkg"], "application/vnd.mcd": ["mcd"], "application/vnd.medcalcdata": ["mc1"], "application/vnd.mediastation.cdkey": ["cdkey"], "application/vnd.mfer": ["mwf"], "application/vnd.mfmp": ["mfm"], "application/vnd.micrografx.flo": ["flo"], "application/vnd.micrografx.igx": ["igx"], "application/vnd.mif": ["mif"], "application/vnd.mobius.daf": ["daf"], "application/vnd.mobius.dis": ["dis"], "application/vnd.mobius.mbk": ["mbk"], "application/vnd.mobius.mqy": ["mqy"], "application/vnd.mobius.msl": ["msl"], "application/vnd.mobius.plc": ["plc"], "application/vnd.mobius.txf": ["txf"], "application/vnd.mophun.application": ["mpn"], "application/vnd.mophun.certificate": ["mpc"], "application/vnd.mozilla.xul+xml": ["xul"], "application/vnd.ms-artgalry": ["cil"], "application/vnd.ms-cab-compressed": ["cab"], "application/vnd.ms-excel": ["xls", "xlm", "xla", "xlc", "xlt", "xlw"], "application/vnd.ms-excel.addin.macroenabled.12": ["xlam"], "application/vnd.ms-excel.sheet.binary.macroenabled.12": ["xlsb"], "application/vnd.ms-excel.sheet.macroenabled.12": ["xlsm"], "application/vnd.ms-excel.template.macroenabled.12": ["xltm"], "application/vnd.ms-fontobject": ["eot"], "application/vnd.ms-htmlhelp": ["chm"], "application/vnd.ms-ims": ["ims"], "application/vnd.ms-lrm": ["lrm"], "application/vnd.ms-officetheme": ["thmx"], "application/vnd.ms-outlook": ["msg"], "application/vnd.ms-pki.seccat": ["cat"], "application/vnd.ms-pki.stl": ["stl"], "application/vnd.ms-powerpoint": ["ppt", "pps", "pot"], "application/vnd.ms-powerpoint.addin.macroenabled.12": ["ppam"], "application/vnd.ms-powerpoint.presentation.macroenabled.12": ["pptm"], "application/vnd.ms-powerpoint.slide.macroenabled.12": ["sldm"], "application/vnd.ms-powerpoint.slideshow.macroenabled.12": ["ppsm"], "application/vnd.ms-powerpoint.template.macroenabled.12": ["potm"], "application/vnd.ms-project": ["mpp", "mpt"], "application/vnd.ms-word.document.macroenabled.12": ["docm"], "application/vnd.ms-word.template.macroenabled.12": ["dotm"], "application/vnd.ms-works": ["wps", "wks", "wcm", "wdb"], "application/vnd.ms-wpl": ["wpl"], "application/vnd.ms-xpsdocument": ["xps"], "application/vnd.mseq": ["mseq"], "application/vnd.musician": ["mus"], "application/vnd.muvee.style": ["msty"], "application/vnd.mynfc": ["taglet"], "application/vnd.neurolanguage.nlu": ["nlu"], "application/vnd.nitf": ["ntf", "nitf"], "application/vnd.noblenet-directory": ["nnd"], "application/vnd.noblenet-sealer": ["nns"], "application/vnd.noblenet-web": ["nnw"], "application/vnd.nokia.n-gage.data": ["ngdat"], "application/vnd.nokia.n-gage.symbian.install": ["n-gage"], "application/vnd.nokia.radio-preset": ["rpst"], "application/vnd.nokia.radio-presets": ["rpss"], "application/vnd.novadigm.edm": ["edm"], "application/vnd.novadigm.edx": ["edx"], "application/vnd.novadigm.ext": ["ext"], "application/vnd.oasis.opendocument.chart": ["odc"], "application/vnd.oasis.opendocument.chart-template": ["otc"], "application/vnd.oasis.opendocument.database": ["odb"], "application/vnd.oasis.opendocument.formula": ["odf"], "application/vnd.oasis.opendocument.formula-template": ["odft"], "application/vnd.oasis.opendocument.graphics": ["odg"], "application/vnd.oasis.opendocument.graphics-template": ["otg"], "application/vnd.oasis.opendocument.image": ["odi"], "application/vnd.oasis.opendocument.image-template": ["oti"], "application/vnd.oasis.opendocument.presentation": ["odp"], "application/vnd.oasis.opendocument.presentation-template": ["otp"], "application/vnd.oasis.opendocument.spreadsheet": ["ods"], "application/vnd.oasis.opendocument.spreadsheet-template": ["ots"], "application/vnd.oasis.opendocument.text": ["odt"], "application/vnd.oasis.opendocument.text-master": ["odm"], "application/vnd.oasis.opendocument.text-template": ["ott"], "application/vnd.oasis.opendocument.text-web": ["oth"], "application/vnd.olpc-sugar": ["xo"], "application/vnd.oma.dd2+xml": ["dd2"], "application/vnd.openofficeorg.extension": ["oxt"], "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"], "application/vnd.openxmlformats-officedocument.presentationml.slide": ["sldx"], "application/vnd.openxmlformats-officedocument.presentationml.slideshow": ["ppsx"], "application/vnd.openxmlformats-officedocument.presentationml.template": ["potx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.template": ["xltx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.template": ["dotx"], "application/vnd.osgeo.mapguide.package": ["mgp"], "application/vnd.osgi.dp": ["dp"], "application/vnd.osgi.subsystem": ["esa"], "application/vnd.palm": ["pdb", "pqa", "oprc"], "application/vnd.pawaafile": ["paw"], "application/vnd.pg.format": ["str"], "application/vnd.pg.osasli": ["ei6"], "application/vnd.picsel": ["efif"], "application/vnd.pmi.widget": ["wg"], "application/vnd.pocketlearn": ["plf"], "application/vnd.powerbuilder6": ["pbd"], "application/vnd.previewsystems.box": ["box"], "application/vnd.proteus.magazine": ["mgz"], "application/vnd.publishare-delta-tree": ["qps"], "application/vnd.pvi.ptid1": ["ptid"], "application/vnd.quark.quarkxpress": ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"], "application/vnd.realvnc.bed": ["bed"], "application/vnd.recordare.musicxml": ["mxl"], "application/vnd.recordare.musicxml+xml": ["musicxml"], "application/vnd.rig.cryptonote": ["cryptonote"], "application/vnd.rim.cod": ["cod"], "application/vnd.rn-realmedia": ["rm"], "application/vnd.rn-realmedia-vbr": ["rmvb"], "application/vnd.route66.link66+xml": ["link66"], "application/vnd.sailingtracker.track": ["st"], "application/vnd.seemail": ["see"], "application/vnd.sema": ["sema"], "application/vnd.semd": ["semd"], "application/vnd.semf": ["semf"], "application/vnd.shana.informed.formdata": ["ifm"], "application/vnd.shana.informed.formtemplate": ["itp"], "application/vnd.shana.informed.interchange": ["iif"], "application/vnd.shana.informed.package": ["ipk"], "application/vnd.simtech-mindmapper": ["twd", "twds"], "application/vnd.smaf": ["mmf"], "application/vnd.smart.teacher": ["teacher"], "application/vnd.solent.sdkm+xml": ["sdkm", "sdkd"], "application/vnd.spotfire.dxp": ["dxp"], "application/vnd.spotfire.sfs": ["sfs"], "application/vnd.stardivision.calc": ["sdc"], "application/vnd.stardivision.draw": ["sda"], "application/vnd.stardivision.impress": ["sdd"], "application/vnd.stardivision.math": ["smf"], "application/vnd.stardivision.writer": ["sdw", "vor"], "application/vnd.stardivision.writer-global": ["sgl"], "application/vnd.stepmania.package": ["smzip"], "application/vnd.stepmania.stepchart": ["sm"], "application/vnd.sun.wadl+xml": ["wadl"], "application/vnd.sun.xml.calc": ["sxc"], "application/vnd.sun.xml.calc.template": ["stc"], "application/vnd.sun.xml.draw": ["sxd"], "application/vnd.sun.xml.draw.template": ["std"], "application/vnd.sun.xml.impress": ["sxi"], "application/vnd.sun.xml.impress.template": ["sti"], "application/vnd.sun.xml.math": ["sxm"], "application/vnd.sun.xml.writer": ["sxw"], "application/vnd.sun.xml.writer.global": ["sxg"], "application/vnd.sun.xml.writer.template": ["stw"], "application/vnd.sus-calendar": ["sus", "susp"], "application/vnd.svd": ["svd"], "application/vnd.symbian.install": ["sis", "sisx"], "application/vnd.syncml+xml": ["xsm"], "application/vnd.syncml.dm+wbxml": ["bdm"], "application/vnd.syncml.dm+xml": ["xdm"], "application/vnd.tao.intent-module-archive": ["tao"], "application/vnd.tcpdump.pcap": ["pcap", "cap", "dmp"], "application/vnd.tmobile-livetv": ["tmo"], "application/vnd.trid.tpt": ["tpt"], "application/vnd.triscape.mxs": ["mxs"], "application/vnd.trueapp": ["tra"], "application/vnd.ufdl": ["ufd", "ufdl"], "application/vnd.uiq.theme": ["utz"], "application/vnd.umajin": ["umj"], "application/vnd.unity": ["unityweb"], "application/vnd.uoml+xml": ["uoml"], "application/vnd.vcx": ["vcx"], "application/vnd.visio": ["vsd", "vst", "vss", "vsw"], "application/vnd.visionary": ["vis"], "application/vnd.vsf": ["vsf"], "application/vnd.wap.wbxml": ["wbxml"], "application/vnd.wap.wmlc": ["wmlc"], "application/vnd.wap.wmlscriptc": ["wmlsc"], "application/vnd.webturbo": ["wtb"], "application/vnd.wolfram.player": ["nbp"], "application/vnd.wordperfect": ["wpd"], "application/vnd.wqd": ["wqd"], "application/vnd.wt.stf": ["stf"], "application/vnd.xara": ["xar"], "application/vnd.xfdl": ["xfdl"], "application/vnd.yamaha.hv-dic": ["hvd"], "application/vnd.yamaha.hv-script": ["hvs"], "application/vnd.yamaha.hv-voice": ["hvp"], "application/vnd.yamaha.openscoreformat": ["osf"], "application/vnd.yamaha.openscoreformat.osfpvg+xml": ["osfpvg"], "application/vnd.yamaha.smaf-audio": ["saf"], "application/vnd.yamaha.smaf-phrase": ["spf"], "application/vnd.yellowriver-custom-menu": ["cmp"], "application/vnd.zul": ["zir", "zirz"], "application/vnd.zzazz.deck+xml": ["zaz"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/x-7z-compressed": ["7z"], "application/x-abiword": ["abw"], "application/x-ace-compressed": ["ace"], "application/x-apple-diskimage": [], "application/x-arj": ["arj"], "application/x-authorware-bin": ["aab", "x32", "u32", "vox"], "application/x-authorware-map": ["aam"], "application/x-authorware-seg": ["aas"], "application/x-bcpio": ["bcpio"], "application/x-bdoc": [], "application/x-bittorrent": ["torrent"], "application/x-blorb": ["blb", "blorb"], "application/x-bzip": ["bz"], "application/x-bzip2": ["bz2", "boz"], "application/x-cbr": ["cbr", "cba", "cbt", "cbz", "cb7"], "application/x-cdlink": ["vcd"], "application/x-cfs-compressed": ["cfs"], "application/x-chat": ["chat"], "application/x-chess-pgn": ["pgn"], "application/x-chrome-extension": ["crx"], "application/x-cocoa": ["cco"], "application/x-conference": ["nsc"], "application/x-cpio": ["cpio"], "application/x-csh": ["csh"], "application/x-debian-package": ["udeb"], "application/x-dgc-compressed": ["dgc"], "application/x-director": ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"], "application/x-doom": ["wad"], "application/x-dtbncx+xml": ["ncx"], "application/x-dtbook+xml": ["dtb"], "application/x-dtbresource+xml": ["res"], "application/x-dvi": ["dvi"], "application/x-envoy": ["evy"], "application/x-eva": ["eva"], "application/x-font-bdf": ["bdf"], "application/x-font-ghostscript": ["gsf"], "application/x-font-linux-psf": ["psf"], "application/x-font-pcf": ["pcf"], "application/x-font-snf": ["snf"], "application/x-font-type1": ["pfa", "pfb", "pfm", "afm"], "application/x-freearc": ["arc"], "application/x-futuresplash": ["spl"], "application/x-gca-compressed": ["gca"], "application/x-glulx": ["ulx"], "application/x-gnumeric": ["gnumeric"], "application/x-gramps-xml": ["gramps"], "application/x-gtar": ["gtar"], "application/x-hdf": ["hdf"], "application/x-httpd-php": ["php"], "application/x-install-instructions": ["install"], "application/x-iso9660-image": [], "application/x-java-archive-diff": ["jardiff"], "application/x-java-jnlp-file": ["jnlp"], "application/x-latex": ["latex"], "application/x-lua-bytecode": ["luac"], "application/x-lzh-compressed": ["lzh", "lha"], "application/x-makeself": ["run"], "application/x-mie": ["mie"], "application/x-mobipocket-ebook": ["prc", "mobi"], "application/x-ms-application": ["application"], "application/x-ms-shortcut": ["lnk"], "application/x-ms-wmd": ["wmd"], "application/x-ms-wmz": ["wmz"], "application/x-ms-xbap": ["xbap"], "application/x-msaccess": ["mdb"], "application/x-msbinder": ["obd"], "application/x-mscardfile": ["crd"], "application/x-msclip": ["clp"], "application/x-msdos-program": [], "application/x-msdownload": ["com", "bat"], "application/x-msmediaview": ["mvb", "m13", "m14"], "application/x-msmetafile": ["wmf", "emf", "emz"], "application/x-msmoney": ["mny"], "application/x-mspublisher": ["pub"], "application/x-msschedule": ["scd"], "application/x-msterminal": ["trm"], "application/x-mswrite": ["wri"], "application/x-netcdf": ["nc", "cdf"], "application/x-ns-proxy-autoconfig": ["pac"], "application/x-nzb": ["nzb"], "application/x-perl": ["pl", "pm"], "application/x-pilot": [], "application/x-pkcs12": ["p12", "pfx"], "application/x-pkcs7-certificates": ["p7b", "spc"], "application/x-pkcs7-certreqresp": ["p7r"], "application/x-rar-compressed": ["rar"], "application/x-redhat-package-manager": ["rpm"], "application/x-research-info-systems": ["ris"], "application/x-sea": ["sea"], "application/x-sh": ["sh"], "application/x-shar": ["shar"], "application/x-shockwave-flash": ["swf"], "application/x-silverlight-app": ["xap"], "application/x-sql": ["sql"], "application/x-stuffit": ["sit"], "application/x-stuffitx": ["sitx"], "application/x-subrip": ["srt"], "application/x-sv4cpio": ["sv4cpio"], "application/x-sv4crc": ["sv4crc"], "application/x-t3vm-image": ["t3"], "application/x-tads": ["gam"], "application/x-tar": ["tar"], "application/x-tcl": ["tcl", "tk"], "application/x-tex": ["tex"], "application/x-tex-tfm": ["tfm"], "application/x-texinfo": ["texinfo", "texi"], "application/x-tgif": ["obj"], "application/x-ustar": ["ustar"], "application/x-virtualbox-hdd": ["hdd"], "application/x-virtualbox-ova": ["ova"], "application/x-virtualbox-ovf": ["ovf"], "application/x-virtualbox-vbox": ["vbox"], "application/x-virtualbox-vbox-extpack": ["vbox-extpack"], "application/x-virtualbox-vdi": ["vdi"], "application/x-virtualbox-vhd": ["vhd"], "application/x-virtualbox-vmdk": ["vmdk"], "application/x-wais-source": ["src"], "application/x-web-app-manifest+json": ["webapp"], "application/x-x509-ca-cert": ["der", "crt", "pem"], "application/x-xfig": ["fig"], "application/x-xliff+xml": ["xlf"], "application/x-xpinstall": ["xpi"], "application/x-xz": ["xz"], "application/x-zmachine": ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"], "application/xaml+xml": ["xaml"], "application/xcap-diff+xml": ["xdf"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": [], "audio/adpcm": ["adp"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mp3": [], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/vnd.dece.audio": ["uva", "uvva"], "audio/vnd.digital-winds": ["eol"], "audio/vnd.dra": ["dra"], "audio/vnd.dts": ["dts"], "audio/vnd.dts.hd": ["dtshd"], "audio/vnd.lucent.voice": ["lvp"], "audio/vnd.ms-playready.media.pya": ["pya"], "audio/vnd.nuera.ecelp4800": ["ecelp4800"], "audio/vnd.nuera.ecelp7470": ["ecelp7470"], "audio/vnd.nuera.ecelp9600": ["ecelp9600"], "audio/vnd.rip": ["rip"], "audio/wav": ["wav"], "audio/wave": [], "audio/webm": ["weba"], "audio/x-aac": ["aac"], "audio/x-aiff": ["aif", "aiff", "aifc"], "audio/x-caf": ["caf"], "audio/x-flac": ["flac"], "audio/x-m4a": [], "audio/x-matroska": ["mka"], "audio/x-mpegurl": ["m3u"], "audio/x-ms-wax": ["wax"], "audio/x-ms-wma": ["wma"], "audio/x-pn-realaudio": ["ram", "ra"], "audio/x-pn-realaudio-plugin": ["rmp"], "audio/x-realaudio": [], "audio/x-wav": [], "audio/xm": ["xm"], "chemical/x-cdx": ["cdx"], "chemical/x-cif": ["cif"], "chemical/x-cmdf": ["cmdf"], "chemical/x-cml": ["cml"], "chemical/x-csml": ["csml"], "chemical/x-xyz": ["xyz"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/apng": ["apng"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/ief": ["ief"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/ktx": ["ktx"], "image/png": ["png"], "image/prs.btif": ["btif"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/tiff": ["tiff", "tif"], "image/vnd.adobe.photoshop": ["psd"], "image/vnd.dece.graphic": ["uvi", "uvvi", "uvg", "uvvg"], "image/vnd.djvu": ["djvu", "djv"], "image/vnd.dvb.subtitle": [], "image/vnd.dwg": ["dwg"], "image/vnd.dxf": ["dxf"], "image/vnd.fastbidsheet": ["fbs"], "image/vnd.fpx": ["fpx"], "image/vnd.fst": ["fst"], "image/vnd.fujixerox.edmics-mmr": ["mmr"], "image/vnd.fujixerox.edmics-rlc": ["rlc"], "image/vnd.ms-modi": ["mdi"], "image/vnd.ms-photo": ["wdp"], "image/vnd.net-fpx": ["npx"], "image/vnd.wap.wbmp": ["wbmp"], "image/vnd.xiff": ["xif"], "image/webp": ["webp"], "image/x-3ds": ["3ds"], "image/x-cmu-raster": ["ras"], "image/x-cmx": ["cmx"], "image/x-freehand": ["fh", "fhc", "fh4", "fh5", "fh7"], "image/x-icon": ["ico"], "image/x-jng": ["jng"], "image/x-mrsid-image": ["sid"], "image/x-ms-bmp": [], "image/x-pcx": ["pcx"], "image/x-pict": ["pic", "pct"], "image/x-portable-anymap": ["pnm"], "image/x-portable-bitmap": ["pbm"], "image/x-portable-graymap": ["pgm"], "image/x-portable-pixmap": ["ppm"], "image/x-rgb": ["rgb"], "image/x-tga": ["tga"], "image/x-xbitmap": ["xbm"], "image/x-xpixmap": ["xpm"], "image/x-xwindowdump": ["xwd"], "message/rfc822": ["eml", "mime"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/vnd.collada+xml": ["dae"], "model/vnd.dwf": ["dwf"], "model/vnd.gdl": ["gdl"], "model/vnd.gtw": ["gtw"], "model/vnd.mts": ["mts"], "model/vnd.vtu": ["vtu"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["x3db", "x3dbz"], "model/x3d+vrml": ["x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/hjson": ["hjson"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/prs.lines.tag": ["dsc"], "text/richtext": ["rtx"], "text/rtf": [], "text/sgml": ["sgml", "sgm"], "text/slim": ["slim", "slm"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vnd.curl": ["curl"], "text/vnd.curl.dcurl": ["dcurl"], "text/vnd.curl.mcurl": ["mcurl"], "text/vnd.curl.scurl": ["scurl"], "text/vnd.dvb.subtitle": ["sub"], "text/vnd.fly": ["fly"], "text/vnd.fmi.flexstor": ["flx"], "text/vnd.graphviz": ["gv"], "text/vnd.in3d.3dml": ["3dml"], "text/vnd.in3d.spot": ["spot"], "text/vnd.sun.j2me.app-descriptor": ["jad"], "text/vnd.wap.wml": ["wml"], "text/vnd.wap.wmlscript": ["wmls"], "text/vtt": ["vtt"], "text/x-asm": ["s", "asm"], "text/x-c": ["c", "cc", "cxx", "cpp", "h", "hh", "dic"], "text/x-component": ["htc"], "text/x-fortran": ["f", "for", "f77", "f90"], "text/x-handlebars-template": ["hbs"], "text/x-java-source": ["java"], "text/x-lua": ["lua"], "text/x-markdown": ["mkd"], "text/x-nfo": ["nfo"], "text/x-opml": ["opml"], "text/x-org": [], "text/x-pascal": ["p", "pas"], "text/x-processing": ["pde"], "text/x-sass": ["sass"], "text/x-scss": ["scss"], "text/x-setext": ["etx"], "text/x-sfv": ["sfv"], "text/x-suse-ymp": ["ymp"], "text/x-uuencode": ["uu"], "text/x-vcalendar": ["vcs"], "text/x-vcard": ["vcf"], "text/xml": [], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/jpeg": ["jpgv"], "video/jpm": ["jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/vnd.dece.hd": ["uvh", "uvvh"], "video/vnd.dece.mobile": ["uvm", "uvvm"], "video/vnd.dece.pd": ["uvp", "uvvp"], "video/vnd.dece.sd": ["uvs", "uvvs"], "video/vnd.dece.video": ["uvv", "uvvv"], "video/vnd.dvb.file": ["dvb"], "video/vnd.fvt": ["fvt"], "video/vnd.mpegurl": ["mxu", "m4u"], "video/vnd.ms-playready.media.pyv": ["pyv"], "video/vnd.uvvu.mp4": ["uvu", "uvvu"], "video/vnd.vivo": ["viv"], "video/webm": ["webm"], "video/x-f4v": ["f4v"], "video/x-fli": ["fli"], "video/x-flv": ["flv"], "video/x-m4v": ["m4v"], "video/x-matroska": ["mkv", "mk3d", "mks"], "video/x-mng": ["mng"], "video/x-ms-asf": ["asf", "asx"], "video/x-ms-vob": ["vob"], "video/x-ms-wm": ["wm"], "video/x-ms-wmv": ["wmv"], "video/x-ms-wmx": ["wmx"], "video/x-ms-wvx": ["wvx"], "video/x-msvideo": ["avi"], "video/x-sgi-movie": ["movie"], "video/x-smv": ["smv"], "x-conference/x-cooltalk": ["ice"] };
  }
});

// node_modules/mime/mime.js
var require_mime = __commonJS({
  "node_modules/mime/mime.js"(exports, module) {
    var path3 = __require("path");
    var fs3 = __require("fs");
    function Mime() {
      this.types = /* @__PURE__ */ Object.create(null);
      this.extensions = /* @__PURE__ */ Object.create(null);
    }
    Mime.prototype.define = function(map) {
      for (var type in map) {
        var exts = map[type];
        for (var i = 0; i < exts.length; i++) {
          if (process.env.DEBUG_MIME && this.types[exts[i]]) {
            console.warn((this._loading || "define()").replace(/.*\//, ""), 'changes "' + exts[i] + '" extension type from ' + this.types[exts[i]] + " to " + type);
          }
          this.types[exts[i]] = type;
        }
        if (!this.extensions[type]) {
          this.extensions[type] = exts[0];
        }
      }
    };
    Mime.prototype.load = function(file) {
      this._loading = file;
      var map = {}, content = fs3.readFileSync(file, "ascii"), lines = content.split(/[\r\n]+/);
      lines.forEach(function(line) {
        var fields = line.replace(/\s*#.*|^\s*|\s*$/g, "").split(/\s+/);
        map[fields.shift()] = fields;
      });
      this.define(map);
      this._loading = null;
    };
    Mime.prototype.lookup = function(path4, fallback) {
      var ext = path4.replace(/^.*[\.\/\\]/, "").toLowerCase();
      return this.types[ext] || fallback || this.default_type;
    };
    Mime.prototype.extension = function(mimeType) {
      var type = mimeType.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
      return this.extensions[type];
    };
    var mime = new Mime();
    mime.define(require_types());
    mime.default_type = mime.lookup("bin");
    mime.Mime = Mime;
    mime.charsets = {
      lookup: function(mimeType, fallback) {
        return /^text\/|^application\/(javascript|json)/.test(mimeType) ? "UTF-8" : fallback;
      }
    };
    module.exports = mime;
  }
});

// node_modules/node-static/lib/node-static/util.js
var require_util = __commonJS({
  "node_modules/node-static/lib/node-static/util.js"(exports) {
    var fs3 = __require("fs");
    var path3 = __require("path");
    exports.mstat = function(dir, files, callback) {
      (function mstat(files2, stats) {
        var file = files2.shift();
        if (file) {
          fs3.stat(path3.join(dir, file), function(e, stat) {
            if (e) {
              callback(e);
            } else {
              mstat(files2, stats.concat([stat]));
            }
          });
        } else {
          callback(null, {
            size: stats.reduce(function(total, stat) {
              return total + stat.size;
            }, 0),
            mtime: stats.reduce(function(latest, stat) {
              return latest > stat.mtime ? latest : stat.mtime;
            }, 0),
            ino: stats.reduce(function(total, stat) {
              return total + stat.ino;
            }, 0)
          });
        }
      })(files.slice(0), []);
    };
  }
});

// node_modules/node-static/lib/node-static.js
var require_node_static = __commonJS({
  "node_modules/node-static/lib/node-static.js"(exports) {
    var fs3 = __require("fs");
    var events = __require("events");
    var buffer = __require("buffer");
    var http2 = __require("http");
    var url = __require("url");
    var path3 = __require("path");
    var mime = require_mime();
    var util = require_util();
    var version = [0, 7, 9];
    var Server = function(root, options) {
      if (root && typeof root === "object") {
        options = root;
        root = null;
      }
      this.root = path3.normalize(path3.resolve(root || "."));
      this.options = options || {};
      this.cache = 3600;
      this.defaultHeaders = {};
      this.options.headers = this.options.headers || {};
      this.options.indexFile = this.options.indexFile || "index.html";
      if ("cache" in this.options) {
        if (typeof this.options.cache === "number") {
          this.cache = this.options.cache;
        } else if (!this.options.cache) {
          this.cache = false;
        }
      }
      if ("serverInfo" in this.options) {
        this.serverInfo = this.options.serverInfo.toString();
      } else {
        this.serverInfo = "node-static/" + version.join(".");
      }
      this.defaultHeaders["server"] = this.serverInfo;
      if (this.cache !== false) {
        this.defaultHeaders["cache-control"] = "max-age=" + this.cache;
      }
      for (var k in this.defaultHeaders) {
        this.options.headers[k] = this.options.headers[k] || this.defaultHeaders[k];
      }
    };
    Server.prototype.serveDir = function(pathname, req, res, finish) {
      var htmlIndex = path3.join(pathname, this.options.indexFile), that = this;
      fs3.stat(htmlIndex, function(e, stat) {
        if (!e) {
          var status = 200;
          var headers = {};
          var originalPathname = decodeURI(url.parse(req.url).pathname);
          if (originalPathname.length && originalPathname.charAt(originalPathname.length - 1) !== "/") {
            return finish(301, { "Location": originalPathname + "/" });
          } else {
            that.respond(null, status, headers, [htmlIndex], stat, req, res, finish);
          }
        } else {
          fs3.readFile(path3.join(pathname, "index.json"), function(e2, contents) {
            if (e2) {
              return finish(404, {});
            }
            var index = JSON.parse(contents);
            streamFiles(index.files);
          });
        }
      });
      function streamFiles(files) {
        util.mstat(pathname, files, function(e, stat) {
          if (e) {
            return finish(404, {});
          }
          that.respond(pathname, 200, {}, files, stat, req, res, finish);
        });
      }
    };
    Server.prototype.serveFile = function(pathname, status, headers, req, res) {
      var that = this;
      var promise = new events.EventEmitter();
      pathname = this.resolve(pathname);
      fs3.stat(pathname, function(e, stat) {
        if (e) {
          return promise.emit("error", e);
        }
        that.respond(null, status, headers, [pathname], stat, req, res, function(status2, headers2) {
          that.finish(status2, headers2, req, res, promise);
        });
      });
      return promise;
    };
    Server.prototype.finish = function(status, headers, req, res, promise, callback) {
      var result = {
        status,
        headers,
        message: http2.STATUS_CODES[status]
      };
      headers["server"] = this.serverInfo;
      if (!status || status >= 400) {
        if (callback) {
          callback(result);
        } else {
          if (promise.listeners("error").length > 0) {
            promise.emit("error", result);
          } else {
            res.writeHead(status, headers);
            res.end();
          }
        }
      } else {
        if (status !== 200 || req.method !== "GET") {
          res.writeHead(status, headers);
          res.end();
        }
        callback && callback(null, result);
        promise.emit("success", result);
      }
    };
    Server.prototype.servePath = function(pathname, status, headers, req, res, finish) {
      var that = this, promise = new events.EventEmitter();
      pathname = this.resolve(pathname);
      if (pathname.indexOf(that.root) === 0) {
        fs3.stat(pathname, function(e, stat) {
          if (e) {
            finish(404, {});
          } else if (stat.isFile()) {
            that.respond(null, status, headers, [pathname], stat, req, res, finish);
          } else if (stat.isDirectory()) {
            that.serveDir(pathname, req, res, finish);
          } else {
            finish(400, {});
          }
        });
      } else {
        finish(403, {});
      }
      return promise;
    };
    Server.prototype.resolve = function(pathname) {
      return path3.resolve(path3.join(this.root, pathname));
    };
    Server.prototype.serve = function(req, res, callback) {
      var that = this, promise = new events.EventEmitter(), pathname;
      var finish = function(status, headers) {
        that.finish(status, headers, req, res, promise, callback);
      };
      try {
        pathname = decodeURI(url.parse(req.url).pathname);
      } catch (e) {
        return process.nextTick(function() {
          return finish(400, {});
        });
      }
      process.nextTick(function() {
        that.servePath(pathname, 200, {}, req, res, finish).on("success", function(result) {
          promise.emit("success", result);
        }).on("error", function(err) {
          promise.emit("error");
        });
      });
      if (!callback) {
        return promise;
      }
    };
    Server.prototype.gzipOk = function(req, contentType) {
      var enable = this.options.gzip;
      if (enable && (typeof enable === "boolean" || contentType && enable instanceof RegExp && enable.test(contentType))) {
        var acceptEncoding = req.headers["accept-encoding"];
        return acceptEncoding && acceptEncoding.indexOf("gzip") >= 0;
      }
      return false;
    };
    Server.prototype.respondGzip = function(pathname, status, contentType, _headers, files, stat, req, res, finish) {
      var that = this;
      if (files.length == 1 && this.gzipOk(req, contentType)) {
        var gzFile = files[0] + ".gz";
        fs3.stat(gzFile, function(e, gzStat) {
          if (!e && gzStat.isFile()) {
            var vary = _headers["Vary"];
            _headers["Vary"] = (vary && vary != "Accept-Encoding" ? vary + ", " : "") + "Accept-Encoding";
            _headers["Content-Encoding"] = "gzip";
            stat.size = gzStat.size;
            files = [gzFile];
          }
          that.respondNoGzip(pathname, status, contentType, _headers, files, stat, req, res, finish);
        });
      } else {
        that.respondNoGzip(pathname, status, contentType, _headers, files, stat, req, res, finish);
      }
    };
    Server.prototype.parseByteRange = function(req, stat) {
      var byteRange = {
        from: 0,
        to: 0,
        valid: false
      };
      var rangeHeader = req.headers["range"];
      var flavor = "bytes=";
      if (rangeHeader) {
        if (rangeHeader.indexOf(flavor) == 0 && rangeHeader.indexOf(",") == -1) {
          rangeHeader = rangeHeader.substr(flavor.length).split("-");
          byteRange.from = parseInt(rangeHeader[0]);
          byteRange.to = parseInt(rangeHeader[1]);
          if (isNaN(byteRange.from) && !isNaN(byteRange.to)) {
            byteRange.from = stat.size - byteRange.to;
            byteRange.to = stat.size ? stat.size - 1 : 0;
          } else if (!isNaN(byteRange.from) && isNaN(byteRange.to)) {
            byteRange.to = stat.size ? stat.size - 1 : 0;
          }
          if (!isNaN(byteRange.from) && !!byteRange.to && 0 <= byteRange.from && byteRange.from < byteRange.to) {
            byteRange.valid = true;
          } else {
            console.warn("Request contains invalid range header: ", rangeHeader);
          }
        } else {
          console.warn("Request contains unsupported range header: ", rangeHeader);
        }
      }
      return byteRange;
    };
    Server.prototype.respondNoGzip = function(pathname, status, contentType, _headers, files, stat, req, res, finish) {
      var mtime = Date.parse(stat.mtime), key = pathname || files[0], headers = {}, clientETag = req.headers["if-none-match"], clientMTime = Date.parse(req.headers["if-modified-since"]), startByte = 0, length = stat.size, byteRange = this.parseByteRange(req, stat);
      if (files.length == 1 && byteRange.valid) {
        if (byteRange.to < length) {
          startByte = byteRange.from;
          length = byteRange.to - byteRange.from + 1;
          status = 206;
          headers["Content-Range"] = "bytes " + byteRange.from + "-" + byteRange.to + "/" + stat.size;
        } else {
          byteRange.valid = false;
          console.warn("Range request exceeds file boundaries, goes until byte no", byteRange.to, "against file size of", length, "bytes");
        }
      }
      if (!byteRange.valid && req.headers["range"]) {
        console.error(new Error("Range request present but invalid, might serve whole file instead"));
      }
      for (var k in this.options.headers) {
        headers[k] = this.options.headers[k];
      }
      for (var k in _headers) {
        headers[k] = _headers[k];
      }
      headers["Etag"] = JSON.stringify([stat.ino, stat.size, mtime].join("-"));
      headers["Date"] = (/* @__PURE__ */ new Date()).toUTCString();
      headers["Last-Modified"] = new Date(stat.mtime).toUTCString();
      headers["Content-Type"] = contentType;
      headers["Content-Length"] = length;
      for (var k in _headers) {
        headers[k] = _headers[k];
      }
      if ((clientMTime || clientETag) && (!clientETag || clientETag === headers["Etag"]) && (!clientMTime || clientMTime >= mtime)) {
        [
          "Content-Encoding",
          "Content-Language",
          "Content-Length",
          "Content-Location",
          "Content-MD5",
          "Content-Range",
          "Content-Type",
          "Expires",
          "Last-Modified"
        ].forEach(function(entityHeader) {
          delete headers[entityHeader];
        });
        finish(304, headers);
      } else {
        res.writeHead(status, headers);
        this.stream(key, files, length, startByte, res, function(e) {
          if (e) {
            return finish(500, {});
          }
          finish(status, headers);
        });
      }
    };
    Server.prototype.respond = function(pathname, status, _headers, files, stat, req, res, finish) {
      var contentType = _headers["Content-Type"] || mime.lookup(files[0]) || "application/octet-stream";
      if (this.options.gzip) {
        this.respondGzip(pathname, status, contentType, _headers, files, stat, req, res, finish);
      } else {
        this.respondNoGzip(pathname, status, contentType, _headers, files, stat, req, res, finish);
      }
    };
    Server.prototype.stream = function(pathname, files, length, startByte, res, callback) {
      (function streamFile(files2, offset) {
        var file = files2.shift();
        if (file) {
          file = path3.resolve(file) === path3.normalize(file) ? file : path3.join(pathname || ".", file);
          fs3.createReadStream(file, {
            flags: "r",
            mode: 438,
            start: startByte,
            end: startByte + (length ? length - 1 : 0)
          }).on("data", function(chunk) {
            if (chunk.length && offset < length && offset >= 0) {
              offset += chunk.length;
            }
          }).on("close", function() {
            streamFile(files2, offset);
          }).on("error", function(err) {
            callback(err);
            console.error(err);
          }).pipe(res, { end: false });
        } else {
          res.end();
          callback(null, offset);
        }
      })(files.slice(0), 0);
    };
    exports.Server = Server;
    exports.version = version;
    exports.mime = mime;
  }
});

// src/lib/index.ts
var BaseAdapter = () => ({
  beforeAll: async (s) => s,
  beforeEach: async function(subject, initialValues, x, testResource, pm) {
    return subject;
  },
  afterEach: async (s) => s,
  afterAll: (store) => void 0,
  butThen: async (store, thenCb) => {
    return thenCb(store);
  },
  andWhen: async (store, whenCB, testResource, pm) => {
    try {
      await whenCB(store, testResource, pm);
    } catch (error) {
      console.error("Error in andWhen:", error);
      throw error;
    }
  },
  assertThis: (x) => x
});
var DefaultAdapter = (p) => {
  return {
    ...BaseAdapter,
    ...p
  };
};
var defaultTestResourceRequirement = {
  ports: 0
};

// src/lib/pmProxy.ts
var baseProxy = function(pm, mappings) {
  return new Proxy(pm, {
    get: (target, prop, receiver) => {
      for (const mapping of mappings) {
        const method = mapping[0];
        const arger = mapping[1];
        if (prop === method) {
          return (...x) => target[prop](arger(...x));
        }
      }
      return (...x) => target[prop](...x);
    }
  });
};
var butThenProxy = (pm, filepath) => {
  return baseProxy(pm, [
    [
      "screencast",
      (opts, p) => {
        const path3 = `${filepath}/butThen/${opts.path}`;
        pm.currentStep?.artifacts?.push(path3);
        return [
          {
            ...opts,
            path: path3
          },
          p
        ];
      }
    ],
    [
      "createWriteStream",
      (fp) => {
        const path3 = `${filepath}/butThen/${fp}`;
        pm.currentStep?.artifacts?.push(path3);
        return [path3];
      }
    ],
    [
      "writeFileSync",
      (fp, contents) => {
        const path3 = `${filepath}/butThen/${fp}`;
        pm.currentStep?.artifacts?.push(path3);
        return [path3, contents];
      }
    ],
    [
      "customScreenShot",
      (opts, p) => {
        const path3 = `${filepath}/butThen/${opts.path}`;
        pm.currentStep?.artifacts?.push(path3);
        return [
          {
            ...opts,
            path: path3
          },
          p
        ];
      }
    ]
  ]);
};
var andWhenProxy = (pm, filepath) => baseProxy(pm, [
  [
    "screencast",
    (opts, p) => [
      {
        ...opts,
        path: `${filepath}/andWhen/${opts.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`${filepath}/andWhen/${fp}`]],
  ["writeFileSync", (fp, contents) => [`${filepath}/andWhen${fp}`, contents]],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `${filepath}/andWhen${opts.path}`
      },
      p
    ]
  ]
]);
var afterEachProxy = (pm, suite, given) => baseProxy(pm, [
  [
    "screencast",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/given-${given}/afterEach/${opts.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`suite-${suite}/afterEach/${fp}`]],
  [
    "writeFileSync",
    (fp, contents) => [
      `suite-${suite}/given-${given}/afterEach/${fp}`,
      contents
    ]
  ],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/given-${given}/afterEach/${opts.path}`
      },
      p
    ]
  ]
]);
var beforeEachProxy = (pm, suite) => baseProxy(pm, [
  [
    "screencast",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/beforeEach/${opts.path}`
      },
      p
    ]
  ],
  [
    "writeFileSync",
    (fp, contents) => [`suite-${suite}/beforeEach/${fp}`, contents]
  ],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/beforeEach/${opts.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`suite-${suite}/beforeEach/${fp}`]]
]);
var beforeAllProxy = (pm, suite) => baseProxy(pm, [
  [
    "writeFileSync",
    (fp, contents) => [`suite-${suite}/beforeAll/${fp}`, contents]
  ],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/beforeAll/${opts.path}`
      },
      p
    ]
  ],
  ["createWriteStream", (fp) => [`suite-${suite}/beforeAll/${fp}`]]
]);
var afterAllProxy = (pm, suite) => baseProxy(pm, [
  ["createWriteStream", (fp) => [`suite-${suite}/afterAll/${fp}`]],
  [
    "writeFileSync",
    (fp, contents) => [`suite-${suite}/afterAll/${fp}`, contents]
  ],
  [
    "customScreenShot",
    (opts, p) => [
      {
        ...opts,
        path: `suite-${suite}/afterAll/${opts.path}`
      },
      p
    ]
  ]
]);

// src/lib/abstractBase.ts
var BaseGiven = class {
  constructor(name, features, whens, thens, givenCB, initialValues) {
    this.artifacts = [];
    this.name = name;
    this.features = features;
    this.whens = whens;
    this.thens = thens;
    this.givenCB = givenCB;
    this.initialValues = initialValues;
  }
  addArtifact(path3) {
    console.log(`[Artifact] Adding to ${this.constructor.name}:`, path3);
    this.artifacts.push(path3);
  }
  beforeAll(store) {
    return store;
  }
  toObj() {
    return {
      key: this.key,
      name: this.name,
      whens: this.whens.map((w) => {
        if (w && w.toObj)
          return w.toObj();
        console.error("w is not as expected!", w.toString());
        return {};
      }),
      thens: this.thens.map((t) => t.toObj()),
      error: this.error ? [this.error, this.error.stack] : null,
      failed: this.failed,
      features: this.features,
      artifacts: this.artifacts
    };
  }
  async afterEach(store, key, artifactory, pm) {
    return store;
  }
  async give(subject, key, testResourceConfiguration, tester, artifactory, tLog, pm, suiteNdx) {
    this.key = key;
    tLog(`
 ${this.key}`);
    tLog(`
 Given: ${this.name}`);
    const givenArtifactory = (fPath, value) => artifactory(`given-${key}/${fPath}`, value);
    this.uberCatcher((e) => {
      console.error(e.toString());
      this.error = e.error;
      tLog(e.stack);
    });
    try {
      const proxiedPm = beforeEachProxy(pm, suiteNdx.toString());
      console.log(`[Given] Setting currentStep for beforeEach:`, this.name);
      proxiedPm.currentStep = this;
      this.store = await this.givenThat(
        subject,
        testResourceConfiguration,
        givenArtifactory,
        this.givenCB,
        this.initialValues,
        proxiedPm
      );
    } catch (e) {
      console.error("Given failure: ", e.toString());
      this.error = e;
      throw e;
    }
    try {
      for (const [whenNdx, whenStep] of this.whens.entries()) {
        await whenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/when/${whenNdx}`
        );
      }
      for (const [thenNdx, thenStep] of this.thens.entries()) {
        const t = await thenStep.test(
          this.store,
          testResourceConfiguration,
          tLog,
          pm,
          `suite-${suiteNdx}/given-${key}/then-${thenNdx}`
        );
        tester(t);
      }
    } catch (e) {
      this.failed = true;
      tLog(e.stack);
      throw e;
    } finally {
      try {
        await this.afterEach(
          this.store,
          this.key,
          givenArtifactory,
          afterEachProxy(pm, suiteNdx.toString(), key)
        );
      } catch (e) {
        console.error("afterEach failed!", e.toString());
        this.failed = e;
        throw e;
      }
    }
    return this.store;
  }
};
var BaseWhen = class {
  constructor(name, whenCB) {
    this.artifacts = [];
    this.name = name;
    this.whenCB = whenCB;
  }
  toObj() {
    console.log("toObj error", this.error);
    if (this.error) {
      return {
        name: this.name,
        error: this.error && this.error.name + this.error.stack,
        artifacts: this.artifacts
      };
    } else {
      return {
        name: this.name,
        artifacts: this.artifacts
      };
    }
  }
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    try {
      tLog(" When:", this.name);
      console.debug("[DEBUG] Executing When step:", this.name.toString());
      const proxiedPm = andWhenProxy(pm, filepath);
      console.log(`[When] Setting currentStep for andWhen:`, this.name);
      proxiedPm.currentStep = this;
      const result = await this.andWhen(
        store,
        this.whenCB,
        testResourceConfiguration,
        proxiedPm
      );
      console.debug("[DEBUG] When step completed:", this.name.toString());
      return result;
    } catch (e) {
      console.error(
        "[ERROR] When step failed:",
        this.name.toString(),
        e.toString()
      );
      this.error = e;
      throw e;
    }
  }
};
var BaseThen = class {
  constructor(name, thenCB) {
    this.artifacts = [];
    this.name = name;
    this.thenCB = thenCB;
    this.error = false;
  }
  toObj() {
    return {
      name: this.name,
      error: this.error,
      artifacts: this.artifacts
    };
  }
  async test(store, testResourceConfiguration, tLog, pm, filepath) {
    const proxiedPm = butThenProxy(pm, filepath);
    console.log(`[Then] Setting currentStep for butThen:`, this.name);
    proxiedPm.currentStep = this;
    return this.butThen(
      store,
      async (s) => {
        if (typeof this.thenCB === "function") {
          return await this.thenCB(s, proxiedPm);
        } else {
          return this.thenCB;
        }
      },
      testResourceConfiguration,
      butThenProxy(pm, filepath)
    ).catch((e) => {
      this.error = e.toString();
    });
  }
};

// src/lib/basebuilder.ts
var BaseBuilder = class {
  constructor(input, suitesOverrides, givenOverides, whenOverides, thenOverides, testResourceRequirement, testSpecification) {
    this.artifacts = [];
    this.artifacts = [];
    this.testResourceRequirement = testResourceRequirement;
    this.suitesOverrides = suitesOverrides;
    this.givenOverides = givenOverides;
    this.whenOverides = whenOverides;
    this.thenOverides = thenOverides;
    this.testSpecification = testSpecification;
    this.specs = testSpecification(
      this.Suites(),
      this.Given(),
      this.When(),
      this.Then()
    );
    this.testJobs = this.specs.map((suite) => {
      const suiteRunner = (suite2) => async (puppetMaster, tLog) => {
        const x = await suite2.run(
          input,
          puppetMaster.testResourceConfiguration,
          (fPath, value) => puppetMaster.testArtiFactoryfileWriter(
            tLog,
            (p) => {
              this.artifacts.push(p);
            }
          )(puppetMaster.testResourceConfiguration.fs + "/" + fPath, value),
          tLog,
          puppetMaster
        );
        return x;
      };
      const runner = suiteRunner(suite);
      return {
        test: suite,
        toObj: () => {
          return suite.toObj();
        },
        runner,
        receiveTestResourceConfig: async function(puppetMaster) {
          const tLog = async (...l) => {
          };
          const suiteDone = await runner(puppetMaster, tLog);
          const fails = suiteDone.fails;
          await puppetMaster.writeFileSync([
            `bdd_errors.txt`,
            fails.toString()
          ]);
          await puppetMaster.writeFileSync([
            `tests.json`,
            JSON.stringify(this.toObj(), null, 2)
          ]);
          return {
            failed: fails > 0,
            fails,
            artifacts: this.artifacts || [],
            // logPromise,
            features: suiteDone.features()
          };
        }
      };
    });
  }
  // testsJson() {
  //   puppetMaster.writeFileSync(
  //     `tests.json`,
  //     JSON.stringify({ features: suiteDone.features() }, null, 2)
  //   );
  // }
  Specs() {
    return this.specs;
  }
  Suites() {
    return this.suitesOverrides;
  }
  Given() {
    return this.givenOverides;
  }
  When() {
    return this.whenOverides;
  }
  Then() {
    return this.thenOverides;
  }
};

// src/lib/classBuilder.ts
var ClassBuilder = class extends BaseBuilder {
  constructor(testImplementation, testSpecification, input, suiteKlasser, givenKlasser, whenKlasser, thenKlasser, testResourceRequirement) {
    const classySuites = Object.entries(testImplementation.suites).reduce(
      (a, [key], index) => {
        a[key] = (somestring, givens) => {
          return new suiteKlasser.prototype.constructor(
            somestring,
            index,
            givens
          );
        };
        return a;
      },
      {}
    );
    const classyGivens = Object.entries(testImplementation.givens).reduce(
      (a, [key, g]) => {
        a[key] = (features, whens, thens, ...initialValues) => {
          return new givenKlasser.prototype.constructor(
            key,
            features,
            whens,
            thens,
            testImplementation.givens[key],
            initialValues
          );
        };
        return a;
      },
      {}
    );
    const classyWhens = Object.entries(testImplementation.whens).reduce(
      (a, [key, whEn]) => {
        a[key] = (...payload) => {
          return new whenKlasser.prototype.constructor(
            `${whEn.name}: ${payload && payload.toString()}`,
            whEn(...payload)
          );
        };
        return a;
      },
      {}
    );
    const classyThens = Object.entries(
      testImplementation.thens
    ).reduce(
      (a, [key, thEn]) => {
        a[key] = (expected, ...x) => {
          return new thenKlasser.prototype.constructor(
            `${thEn.name}: ${expected && expected.toString()}`,
            thEn(expected, ...x)
          );
        };
        return a;
      },
      {}
    );
    super(
      input,
      classySuites,
      classyGivens,
      classyWhens,
      classyThens,
      testResourceRequirement,
      testSpecification
    );
  }
};

// src/lib/BaseSuite.ts
var BaseSuite = class {
  constructor(name, index, givens = {}) {
    const suiteName = name || "testSuite";
    if (!suiteName) {
      throw new Error("BaseSuite requires a non-empty name");
    }
    console.log(
      "[DEBUG] BaseSuite constructor - name:",
      suiteName,
      "index:",
      index
    );
    this.name = suiteName;
    this.index = index;
    this.givens = givens;
    this.fails = 0;
    console.log("[DEBUG] BaseSuite initialized:", this.name, this.index);
    console.log("[DEBUG] BaseSuite givens:", Object.keys(givens).toString());
  }
  features() {
    try {
      const features = Object.keys(this.givens).map((k) => this.givens[k].features).flat().filter((value, index, array) => {
        return array.indexOf(value) === index;
      });
      console.debug("[DEBUG] Features extracted:", features.toString());
      return features || [];
    } catch (e) {
      console.error("[ERROR] Failed to extract features:", e);
      return [];
    }
  }
  toObj() {
    const givens = Object.keys(this.givens).map((k) => this.givens[k].toObj());
    return {
      name: this.name,
      givens,
      fails: this.fails,
      failed: this.failed,
      features: this.features()
    };
  }
  setup(s, artifactory, tr, pm) {
    return new Promise((res) => res(s));
  }
  assertThat(t) {
    return !!t;
  }
  afterAll(store, artifactory, pm) {
    return store;
  }
  async run(input, testResourceConfiguration, artifactory, tLog, pm) {
    this.testResourceConfiguration = testResourceConfiguration;
    const suiteArtifactory = (fPath, value) => artifactory(`suite-${this.index}-${this.name}/${fPath}`, value);
    tLog("\nSuite:", this.index, this.name);
    const sNdx = this.index;
    const subject = await this.setup(
      input,
      suiteArtifactory,
      testResourceConfiguration,
      beforeAllProxy(pm, sNdx.toString())
    );
    for (const [gKey, g] of Object.entries(this.givens)) {
      const giver = this.givens[gKey];
      this.store = await giver.give(
        subject,
        gKey,
        testResourceConfiguration,
        this.assertThat,
        suiteArtifactory,
        tLog,
        pm,
        sNdx
      ).catch((e) => {
        this.failed = true;
        this.fails = this.fails + 1;
        throw e;
      });
    }
    try {
      this.afterAll(
        this.store,
        artifactory,
        afterAllProxy(pm, sNdx.toString())
      );
    } catch (e) {
      console.error(e);
    }
    return this;
  }
};

// src/lib/core.ts
var TesterantoCore = class extends ClassBuilder {
  constructor(input, testSpecification, testImplementation, testResourceRequirement = defaultTestResourceRequirement, testAdapter, uberCatcher) {
    const fullAdapter = DefaultAdapter(testAdapter);
    super(
      testImplementation,
      testSpecification,
      input,
      class extends BaseSuite {
        afterAll(store, artifactory, pm) {
          return fullAdapter.afterAll(store, pm);
        }
        assertThat(t) {
          return fullAdapter.assertThis(t);
        }
        async setup(s, artifactory, tr, pm) {
          return (fullAdapter.beforeAll || (async (input2, artifactory2, tr2, pm2) => input2))(
            s,
            this.testResourceConfiguration,
            // artifactory,
            pm
          );
        }
      },
      class Given extends BaseGiven {
        constructor() {
          super(...arguments);
          this.uberCatcher = uberCatcher;
        }
        async givenThat(subject, testResource, artifactory, initializer, initialValues, pm) {
          return fullAdapter.beforeEach(
            subject,
            initializer,
            testResource,
            initialValues,
            pm
          );
        }
        afterEach(store, key, artifactory, pm) {
          return new Promise(
            (res) => res(fullAdapter.afterEach(store, key, pm))
          );
        }
      },
      class When extends BaseWhen {
        async andWhen(store, whenCB, testResource, pm) {
          return await fullAdapter.andWhen(store, whenCB, testResource, pm);
        }
      },
      class Then extends BaseThen {
        async butThen(store, thenCB, testResource, pm) {
          return await fullAdapter.butThen(store, thenCB, testResource, pm);
        }
      },
      testResourceRequirement
    );
  }
};

// src/PM/node.ts
import net from "net";
import fs from "fs";
import path from "path";

// src/PM/index.ts
var PM = class {
};

// src/PM/node.ts
var fPaths = [];
var PM_Node = class extends PM {
  constructor(t, ipcFile) {
    super();
    this.testResourceConfiguration = t;
    this.client = net.createConnection(ipcFile, () => {
      return;
    });
  }
  start() {
    throw new Error("DEPRECATED");
  }
  stop() {
    throw new Error("stop not implemented.");
  }
  send(command, ...argz) {
    const key = Math.random().toString();
    if (!this.client) {
      console.error(
        `Tried to send "${command} (${argz})" but the test has not been started and the IPC client is not established. Exiting as failure!`
      );
      process.exit(-1);
    }
    return new Promise((res) => {
      const myListener = (event) => {
        const x = JSON.parse(event);
        if (x.key === key) {
          process.removeListener("message", myListener);
          res(x.payload);
        }
      };
      process.addListener("message", myListener);
      this.client.write(JSON.stringify([command, ...argz, key]));
    });
  }
  async launchSideCar(n) {
    return this.send(
      "launchSideCar",
      n,
      this.testResourceConfiguration.name
    );
  }
  stopSideCar(n) {
    return this.send(
      "stopSideCar",
      n,
      this.testResourceConfiguration.name
    );
  }
  async pages() {
    return this.send("pages", ...arguments);
  }
  waitForSelector(p, s) {
    return this.send("waitForSelector", ...arguments);
  }
  closePage(p) {
    return this.send("closePage", ...arguments);
  }
  goto(page, url) {
    return this.send("goto", ...arguments);
  }
  async newPage() {
    return this.send("newPage");
  }
  $(selector, page) {
    return this.send("$", ...arguments);
  }
  isDisabled(selector) {
    return this.send("isDisabled", ...arguments);
  }
  getAttribute(selector, attribute, p) {
    return this.send("getAttribute", ...arguments);
  }
  getInnerHtml(selector, p) {
    return this.send("getInnerHtml", ...arguments);
  }
  // setValue(selector: string) {
  //   return this.send("getValue", ...arguments);
  // }
  focusOn(selector) {
    return this.send("focusOn", ...arguments);
  }
  typeInto(selector) {
    return this.send("typeInto", ...arguments);
  }
  page() {
    return this.send("page");
  }
  click(selector) {
    return this.send("click", ...arguments);
  }
  screencast(opts, page) {
    return this.send(
      "screencast",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      page,
      this.testResourceConfiguration.name
    );
  }
  screencastStop(p) {
    return this.send("screencastStop", ...arguments);
  }
  customScreenShot(x, y) {
    const opts = x[0];
    const page = x[1];
    return this.send(
      "customScreenShot",
      {
        ...opts,
        path: this.testResourceConfiguration.fs + "/" + opts.path
      },
      this.testResourceConfiguration.name,
      page
    );
  }
  async existsSync(destFolder) {
    return await this.send(
      "existsSync",
      this.testResourceConfiguration.fs + "/" + destFolder
    );
  }
  mkdirSync() {
    return this.send("mkdirSync", this.testResourceConfiguration.fs + "/");
  }
  async write(uid, contents) {
    return await this.send("write", ...arguments);
  }
  async writeFileSync([filepath, contents]) {
    return await this.send(
      "writeFileSync",
      this.testResourceConfiguration.fs + "/" + filepath,
      contents,
      this.testResourceConfiguration.name
    );
  }
  async createWriteStream(filepath) {
    return await this.send(
      "createWriteStream",
      this.testResourceConfiguration.fs + "/" + filepath,
      this.testResourceConfiguration.name
    );
  }
  async end(uid) {
    return await this.send("end", ...arguments);
  }
  async customclose() {
    return await this.send(
      "customclose",
      this.testResourceConfiguration.fs,
      this.testResourceConfiguration.name
    );
  }
  testArtiFactoryfileWriter(tLog, callback) {
    return (fPath, value) => {
      callback(
        new Promise((res, rej) => {
          tLog("testArtiFactory =>", fPath);
          const cleanPath = path.resolve(fPath);
          fPaths.push(cleanPath.replace(process.cwd(), ``));
          const targetDir = cleanPath.split("/").slice(0, -1).join("/");
          fs.mkdir(targetDir, { recursive: true }, async (error) => {
            if (error) {
              console.error(`\u2757\uFE0FtestArtiFactory failed`, targetDir, error);
            }
            if (Buffer.isBuffer(value)) {
              fs.writeFileSync(fPath, value, "binary");
              res();
            } else if (`string` === typeof value) {
              fs.writeFileSync(fPath, value.toString(), {
                encoding: "utf-8"
              });
              res();
            } else {
              const pipeStream = value;
              const myFile = fs.createWriteStream(fPath);
              pipeStream.pipe(myFile);
              pipeStream.on("close", () => {
                myFile.close();
                res();
              });
            }
          });
        })
      );
    };
  }
  // launch(options?: PuppeteerLaunchOptions): Promise<Browser>;
  startPuppeteer(options) {
  }
};

// src/Node.ts
var ipcfile;
var NodeTesteranto = class extends TesterantoCore {
  constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
    super(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter,
      () => {
      }
    );
  }
  async receiveTestResourceConfig(partialTestResource) {
    console.log("receiveTestResourceConfig", partialTestResource);
    const t = JSON.parse(partialTestResource);
    const pm = new PM_Node(t, ipcfile);
    return await this.testJobs[0].receiveTestResourceConfig(pm);
  }
};
var testeranto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
  try {
    const t = new NodeTesteranto(
      input,
      testSpecification,
      testImplementation,
      testResourceRequirement,
      testAdapter
    );
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
    ipcfile = process.argv[3];
    const f = await t.receiveTestResourceConfig(process.argv[2]);
    console.error("goodbye node with failures", f.fails);
    process.exit(f.fails);
  } catch (e) {
    console.error("goodbye node with caught error", e);
    process.exit(-1);
  }
};
var Node_default = testeranto;

// src/ReportServerLib.ts
var import_node_static = __toESM(require_node_static(), 1);
import http from "http";
import path2 from "path";
import fs2 from "fs";
var fileServer = new import_node_static.default.Server("./", {
  cache: false,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0"
  }
});
var server = http.createServer((req, res) => {
  let responded = false;
  const safeResponse = (handler) => {
    if (responded)
      return;
    responded = true;
    try {
      handler();
    } catch (err) {
      console.error("Error handling request:", err);
      if (!res.headersSent) {
        res.writeHead(500);
      }
      res.end("Internal Server Error");
    }
  };
  req.on("error", (err) => {
    console.error("Request error:", err);
    safeResponse(() => {
      if (!res.headersSent) {
        res.writeHead(400);
      }
      res.end("Bad Request");
    });
  });
  req.on("end", () => {
    safeResponse(() => {
      const filePath = path2.join(process.cwd(), req.url || "");
      fs2.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          fs2.stat(filePath, (dirErr, dirStats) => {
            if (!dirErr && dirStats.isDirectory()) {
              fs2.readdir(filePath, (readErr, files) => {
                if (readErr) {
                  res.writeHead(500);
                  return res.end("Error reading directory");
                }
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(`
                  <html>
                    <head>
                      <title>Directory Listing: ${req.url}</title>
                      <style>
                        body { font-family: sans-serif; margin: 2rem; }
                        h1 { color: #333; }
                        ul { list-style: none; padding: 0; }
                        li { padding: 0.5rem; }
                        li a { color: #0366d6; text-decoration: none; }
                        li a:hover { text-decoration: underline; }
                      </style>
                    </head>
                    <body>
                      <h1>Directory: ${req.url}</h1>
                      <ul>
                        ${files.map(
                  (file) => `
                          <li>
                            <a href="${path2.join(req.url || "", file)}">
                              ${file}${file.endsWith("/") ? "/" : ""}
                            </a>
                          </li>
                        `
                ).join("")}
                      </ul>
                    </body>
                  </html>
                `);
                res.end();
              });
            } else {
              if (!res.headersSent) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("File not found");
              }
            }
          });
          return;
        }
        const serve = () => {
          fileServer.serve(req, res, (err2) => {
            if (err2 && !res.headersSent) {
              res.writeHead(err2.status || 500);
              res.end(err2.message);
            }
          });
        };
        if (!res.headersSent) {
          serve();
        }
      });
    });
  });
  req.resume();
});
server.on("error", (err) => {
  console.error("Server error:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});
var start = (port) => server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log("Serving files from:", process.cwd());
});
var ReportServerOfPort = (port) => start(port);

// src/ReportServer.test.ts/index.ts
var specification = (Suite, Given, When, Then) => [
  Suite.Default("the http server which is used in development", {
    initialization: Given["the http server which is used in development"](
      ["It should serve the front page", "It should serve the ReportApp"],
      [],
      [
        Then["the frontpage looks good"]()
        // Then["the projects page looks good"](),
        // Then["a project page looks good"](),
        // Then["a test page looks good"](),
      ]
    )
  })
];
var implementation = {
  suites: {
    Default: "the http server which is used in  development"
  },
  givens: {
    "the http server which is used in development": function(subject) {
      return subject;
    }
  },
  // There are no "whens", it is a stateless server.
  whens: {},
  thens: {
    "the frontpage looks good": async (port, utils) => {
      debugger;
      const page = await utils.newPage();
      utils.goto(page, `localhost:${port}`);
      utils.customScreenShot({ path: `frontpage.png` }, page);
      return;
    },
    "the projects page looks good": function() {
      throw new Error("Function not implemented.");
    },
    "a project page looks good": function() {
      throw new Error("Function not implemented.");
    },
    "a test page looks good": function() {
      throw new Error("Function not implemented.");
    }
  }
};
var adapter = {
  assertThis: function(x) {
    throw new Error("Function not implemented.");
  },
  andWhen: function(store, whenCB, testResource, pm) {
    throw new Error("Function not implemented.");
  },
  butThen: function(store, thenCB, testResource, pm) {
    throw new Error("Function not implemented.");
  },
  afterAll: function(store, pm) {
    throw new Error("Function not implemented.");
  },
  afterEach: function(store, key, pm) {
    throw new Error("Function not implemented.");
  },
  beforeAll: async function(input, testResource, pm) {
    await new Promise((res, rej) => input(testResource.ports[0]));
    return testResource.ports[0];
  },
  beforeEach: function(subject, initializer, testResource, initialValues, pm) {
    throw new Error("Function not implemented.");
  }
};
var ReportServer_test_default = Node_default(
  ReportServerOfPort,
  specification,
  implementation,
  adapter
);
export {
  ReportServer_test_default as default
};
