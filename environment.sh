# Setting up terminal environment
export SHIPPO_HOME=$(pwd)
export SHIPPO_JS="${SHIPPO_HOME}/"
export NODE_OPTIONS=--openssl-legacy-provider
mkdir -p output
pip3 install -r src/python/requirements.txt
npm --prefix ${SHIPPO_JS} install
alias fedex_start="npm --prefix ${SHIPPO_JS} run fedex_start" 
alias ups_start="npm --prefix ${SHIPPO_JS} run ups_start" 