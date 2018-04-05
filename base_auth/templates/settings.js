class ProductionSettings {
    static siteUrl() {
        return 'https://base-auth-bitclave-com.herokuapp.com/';
    }

    static widgetLocation() {
        return 'widget/button/';
    }
}

class DevelopmentSettings {
    static siteUrl() {
        return 'http://localhost:8000/';
    }

    static widgetLocation() {
        return 'widget/button/';
    }
}

export {ProductionSettings as default};
