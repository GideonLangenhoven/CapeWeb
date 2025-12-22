#!/bin/zsh

Y="#FDE047"
C="#22D3EE"
P="#F472B6"
O="#FB923C"
G="#4ADE80"
E="#0F172A" # Text Color

# Group A: Replace Hex Code (Files already have color prop)
# Regex matches: background: '#......'
# Replacement: background: 'NEW'

sed -i '' "274s/background: '#[A-Fa-f0-9]\{6\}'/background: '$C'/" src/components/CapeWebPillar1.js
sed -i '' "1234s/background: '#[A-Fa-f0-9]\{6\}'/background: '$P'/" src/components/CapeWebPillar1.js
sed -i '' "1365s/background: '#[A-Fa-f0-9]\{6\}'/background: '$O'/" src/components/CapeWebPillar1.js
sed -i '' "1559s/background: '#[A-Fa-f0-9]\{6\}'/background: '$G'/" src/components/CapeWebPillar1.js
sed -i '' "1647s/background: '#[A-Fa-f0-9]\{6\}'/background: '$Y'/" src/components/CapeWebPillar1.js

sed -i '' "253s/background: '#[A-Fa-f0-9]\{6\}'/background: '$C'/" src/components/CapeWebPillar2.js
sed -i '' "455s/background: '#[A-Fa-f0-9]\{6\}'/background: '$P'/" src/components/CapeWebPillar2.js

sed -i '' "206s/background: '#[A-Fa-f0-9]\{6\}'/background: '$P'/" src/components/CapeWebPillar5.js
sed -i '' "252s/background: '#[A-Fa-f0-9]\{6\}'/background: '$O'/" src/components/CapeWebPillar5.js
sed -i '' "303s/background: '#[A-Fa-f0-9]\{6\}'/background: '$G'/" src/components/CapeWebPillar5.js
sed -i '' "353s/background: '#[A-Fa-f0-9]\{6\}'/background: '$Y'/" src/components/CapeWebPillar5.js

sed -i '' "206s/background: '#[A-Fa-f0-9]\{6\}'/background: '$C'/" src/components/CapeWebPillar6.js
sed -i '' "266s/background: '#[A-Fa-f0-9]\{6\}'/background: '$P'/" src/components/CapeWebPillar6.js
sed -i '' "316s/background: '#[A-Fa-f0-9]\{6\}'/background: '$O'/" src/components/CapeWebPillar6.js

sed -i '' "220s/background: '#[A-Fa-f0-9]\{6\}'/background: '$G'/" src/components/CapeWebPillar7.js
sed -i '' "258s/background: '#[A-Fa-f0-9]\{6\}'/background: '$Y'/" src/components/CapeWebPillar7.js
sed -i '' "305s/background: '#[A-Fa-f0-9]\{6\}'/background: '$C'/" src/components/CapeWebPillar7.js

sed -i '' "216s/background: '#[A-Fa-f0-9]\{6\}'/background: '$O'/" src/components/CapeWebPillar11.js
sed -i '' "263s/background: '#[A-Fa-f0-9]\{6\}'/background: '$G'/" src/components/CapeWebPillar11.js
sed -i '' "363s/background: '#[A-Fa-f0-9]\{6\}'/background: '$Y'/" src/components/CapeWebPillar11.js


# Group B: Replace RGBA line (Untouched Files)
# Search: background: .*
# Replace: background: 'NEW', color: 'DARK'

sed -i '' "225s/background: .*/background: '$O', color: '$E'/" src/components/CapeWebPillar4.js
sed -i '' "271s/background: .*/background: '$G', color: '$E'/" src/components/CapeWebPillar4.js
sed -i '' "320s/background: .*/background: '$Y', color: '$E'/" src/components/CapeWebPillar4.js
sed -i '' "378s/background: .*/background: '$C', color: '$E'/" src/components/CapeWebPillar4.js

sed -i '' "216s/background: .*/background: '$P', color: '$E'/" src/components/CapeWebPillar8.js
sed -i '' "251s/background: .*/background: '$O', color: '$E'/" src/components/CapeWebPillar8.js
sed -i '' "301s/background: .*/background: '$G', color: '$E'/" src/components/CapeWebPillar8.js
sed -i '' "353s/background: .*/background: '$Y', color: '$E'/" src/components/CapeWebPillar8.js

sed -i '' "207s/background: .*/background: '$C', color: '$E'/" src/components/CapeWebPillar9.js
sed -i '' "272s/background: .*/background: '$P', color: '$E'/" src/components/CapeWebPillar9.js
sed -i '' "322s/background: .*/background: '$O', color: '$E'/" src/components/CapeWebPillar9.js

sed -i '' "207s/background: .*/background: '$G', color: '$E'/" src/components/CapeWebPillar10.js
sed -i '' "259s/background: .*/background: '$Y', color: '$E'/" src/components/CapeWebPillar10.js
sed -i '' "304s/background: .*/background: '$C', color: '$E'/" src/components/CapeWebPillar10.js
sed -i '' "352s/background: .*/background: '$P', color: '$E'/" src/components/CapeWebPillar10.js

echo "Colors Updated."
