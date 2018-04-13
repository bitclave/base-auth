const BASENodeAPI = new Base.NodeAPI("https://base2-bitclva-com.herokuapp.com");
var Storage = {};

function BASENodeGetNewMnemonic() {
    return BASENodeAPI.accountManager.getNewMnemonic();
}

function BASENodeCheckAccount(mnemonic) {
    BASENodeAPI.accountManager.checkAccount(mnemonic).then(function (account) {
        Storage.account = account;
    });
}

function BASENodeGetAllOffers() {
    BASENodeAPI.offerManager.getAllOffers().then(function (response) {
        Storage.offers = response;
    });
}

function ShowStorage() {
    return Storage;
}
