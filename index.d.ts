export = Proxies;

class ProxySearch {
    ProxySearch: this;
    cachePath: string;
    countryList: {
        BR : 'Brazil',
        US : 'United States',
        SE : 'Sweden',
        RU : 'Russia',
        MY : 'Malaysia',
        CA : 'Canada',
        SG : 'Singapore',
        RO : 'Romania',
        TW : 'Taiwan',
        BG : 'Bulgaria',
        UK : 'United Kingdom',
        NO : 'Norway',
        HK : 'Hong Kong',
        TR : 'Turkey',
        CN : 'China',
        KR : 'Republic Of Korea',
        IT : 'Italy',
        PL : 'Poland',
        FR : 'France',
        DE : 'Germany',
        AU : 'Australia',
        UA : 'Ukraine',
        NL : 'Netherlands',
        BD : 'Bangladesh',
        IN : 'India',
        ES : 'Spain',
        EC : 'Ecuador',
        CZ : 'Czech Republic',
        SK : 'Slovak Republic',
        CH : 'Switzerland',
        CL : 'Chile',
        TH : 'Thailand',
        VE : 'Venezuela',
        SI : 'Slovenia',
        DK : 'Denmark',
        JP : 'Japan',
        PJ : 'Philippines',
        ID : 'Indonesia',
        AT : 'Austria',
        MN : 'Mongolia',
        TZ : 'Tanzania',
        BE : 'Belgium',
        AR : 'Argentina',
        PT : 'Portugal',
        VN : 'Vietnam',
        DM : 'Dominican Republic',
        LV : 'Latvia',
        FI : 'Finland',
        NA : 'Namibia',
        SC : 'Seychelles',
        LU : 'Luxembourg',
        EG : 'Egypt',
        CO : 'Colombia',
        JM : 'Jamaica',
        MX : 'Mexico',
        IM : 'Isle Of Man',
        IR : 'Iran',
        AE : 'United Arab Emirates',
        NI : 'Nicaragua',
        MD : 'Republic Of Moldova',
        TT : 'Trinidad and Tobago',
        SR : 'Suriname',
        CR : 'Costa Rica',
        CU : 'Cuba',
        PE : 'Peru',
        BY : 'Belarus',
        KE : 'Kazakhstan',
        GE : 'Georgia',
        GT : 'Guatemala',
        PA : 'Panama',
        NG : 'Nigeria',
        GU : 'Guam',
        GH : 'Ghana',
        SA : 'Saudi Arabia',
        AM : 'Armenia',
        IE : 'Ireland',
        BN : 'Brunei',
        NP : 'Nepal',
    };
    proxyCrawl(countries: string|object, cacheTime: number|boolean, debug: boolean = false) : Promise;
    getSearchCode(stringCode: string): string|null;
}

class UserAgent {
    UserAgent: this;
    browser: {
        firefox(...args) : string;
        chrome(...args) : string;
        iexplorer(...args) : string;
        opera(...args) : string;
        safari(...args) : string;
    };
    generate() : string;
}

class Request {
    Request: this;
    Client(url: string, options: object, callback: symbol) : object;
    createOption(options: object): object;
}

interface Proxies {
    Proxies: this;
    jQuery(...args): object;
    Request: Request;
    ProxySearch: ProxySearch;
    UserAgent: UserAgent;
}
