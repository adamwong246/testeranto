#!/bin/bash

mkdir -p videos/project0/smil30
cd videos/project0/smil30

# Download main XSD files
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/smil-framework-1.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/smil-attribs-1.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/smil-datatypes-1.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/xml.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/its.xsd

# Download all required XSD files
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-anim.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-control.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-layout.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-link.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-media.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-metainformation.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-smiltext.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-state.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-struct.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-timing.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/SMIL-transition.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/smil-qname-1.mod.xsd
wget https://raw.githubusercontent.com/bliksemlabs/SMIL-xsd/master/smil-profile-model-1.mod.xsd

echo "SMIL XSD files downloaded to smil30 directory"
