const cdn = "https://testingcf.jsdelivr.net/gh";
const countryRegions = [
    {code: "HK", name: "香港", regex: /(香港|HK|Hong Kong|🇭🇰)/i},
    {code: "TW", name: "台湾", regex: /(台湾|台灣|TW|Taiwan|🇹🇼)/i},
    {code: "SG", name: "新加坡", regex: /(新加坡|狮城|SG|Singapore|🇸🇬)/i},
    {code: "JP", name: "日本", regex: /(日本|JP|Japan|东京|🇯🇵)/i},
    {code: "US", name: "美国", regex: /(美国|美國|US|USA|United States|America|🇺🇸)/i},
    {code: "DE", name: "德国", regex: /(德国|DE|Germany|🇩🇪)/i},
    {code: "KR", name: "韩国", regex: /(韩国|韓國|KR|Korea|South Korea|🇰🇷)/i},
    {code: "UK", name: "英国", regex: /(英国|UK|United Kingdom|🇬🇧)/i},
    {code: "CA", name: "加拿大", regex: /(加拿大|CA|Canada|🇨🇦)/i},
    {code: "AU", name: "澳大利亚", regex: /(澳大利亚|AU|Australia|🇦🇺)/i},
    {code: "FR", name: "法国", regex: /(法国|FR|France|🇫🇷)/i},
    {code: "NL", name: "荷兰", regex: /(荷兰|NL|Netherlands|🇳🇱)/i},
];

function getTestUrlForGroup(groupName) {
    switch (groupName) {
        case "YouTube":
            return "https://www.youtube.com/";
        case "AI 服务":
            return "https://chat.openai.com/";
        case "Spotify":
            return "https://www.spotify.com/";
        default:
            return "http://www.gstatic.com/generate_204";
    }
}

function getIconForGroup(groupName) {
    switch (groupName) {
        case "AI 服务":
            return `${cdn}/shindgewongxj/WHATSINStash@master/icon/openai.png`;
        case "YouTube":
            return `${cdn}/Orz-3/mini@master/Color/YouTube.png`;
        case "Spotify":
            return `${cdn}/shindgewongxj/WHATSINStash@master/icon/spotify.png`;
        case "漏网之鱼":
            return `${cdn}/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg`;
        case "广告拦截":
            return `${cdn}/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg`;
        default:
            return "";
    }
}

function overwriteRules(config) {
    const rules = [
        "RULE-SET,applications,DIRECT",
        "RULE-SET,private,DIRECT",
        "RULE-SET,reject,REJECT",
        "RULE-SET,google,PROXY",
        "RULE-SET,proxy,PROXY",
        "RULE-SET,direct,DIRECT",
        "RULE-SET,lancidr,DIRECT",
        "RULE-SET,cncidr,DIRECT",
        "RULE-SET,telegramcidr,PROXY",
        "GEOIP,CN,DIRECT",
        "MATCH,PROXY"
    ]

    const ruleProviders = {
        // 新增的直连和代理规则集
        reject: {
            type: "http",
            behavior: "domain",
            url: `${cdn}/Loyalsoldier/clash-rules@release/reject.txt`,
            path: "./ruleset/reject.yaml",
            interval: 86400
        },

        google: {
            type: "http",
            behavior: "domain",
            url: `${cdn}/Loyalsoldier/clash-rules@release/google.txt`,
            path: "./ruleset/google.yaml",
            interval: 86400
        },

        proxy: {
            type: "http",
            behavior: "domain",
            url: `${cdn}/Loyalsoldier/clash-rules@release/proxy.txt`,
            path: "./ruleset/proxy.yaml",
            interval: 86400
        },

        direct: {
            type: "http",
            behavior: "domain",
            url: `${cdn}/Loyalsoldier/clash-rules@release/direct.txt`,
            path: "./ruleset/direct.yaml",
            interval: 86400
        },

        private: {
            type: "http",
            behavior: "domain",
            url: `${cdn}/Loyalsoldier/clash-rules@release/private.txt`,
            path: "./ruleset/private.yaml",
            interval: 86400
        },

        gfw: {
            type: "http",
            behavior: "domain",
            url: `${cdn}/Loyalsoldier/clash-rules@release/gfw.txt`,
            path: "./ruleset/gfw.yaml",
            interval: 86400
        },

        telegramcidr: {
            type: "http",
            behavior: "ipcidr",
            url: `${cdn}/Loyalsoldier/clash-rules@release/telegramcidr.txt`,
            path: "./ruleset/telegramcidr.yaml",
            interval: 86400
        },

        cncidr: {
            type: "http",
            behavior: "ipcidr",
            url: `${cdn}/Loyalsoldier/clash-rules@release/cncidr.txt`,
            path: "./ruleset/cncidr.yaml",
            interval: 86400
        },

        lancidr: {
            type: "http",
            behavior: "ipcidr",
            url: `${cdn}/Loyalsoldier/clash-rules@release/lancidr.txt`,
            path: "./ruleset/lancidr.yaml",
            interval: 86400
        },

        applications: {
            type: "http",
            behavior: "classical",
            url: `${cdn}/Loyalsoldier/clash-rules@release/applications.txt`,
            path: "./ruleset/applications.yaml",
            interval: 86400
        }
    };

    config["rule-providers"] = {...ruleProviders};
    config.rules = rules;
}

function overwriteProxyGroups(config) {
    const allProxies = config.proxies.map(p => p.name);
    const otherProxies = [];
    const availableCountryCodes = new Set();

    for (const proxyName of allProxies) {
        let matched = false;
        for (const region of countryRegions) {
            if (region.regex.test(proxyName)) {
                availableCountryCodes.add(region.code);
                matched = true;
                break;
            }
        }
        if (!matched) {
            otherProxies.push(proxyName);
        }
    }

    const regionAutoGroups = countryRegions
        .filter(r => availableCountryCodes.has(r.code))
        .map(r => ({
            name: `${r.code} - 自动选择`,
            type: 'url-test', url: 'http://www.gstatic.com/generate_204', interval: 300,
            proxies: allProxies.filter(p => r.regex.test(p)), hidden: true,
        }));

    const regionManualGroups = countryRegions
        .filter(r => availableCountryCodes.has(r.code))
        .map(r => ({
            name: `${r.name} - 手动选择`, type: 'select',
            proxies: allProxies.filter(p => r.regex.test(p)),
        }));

    const otherAutoGroup = otherProxies.length > 0 ? {
        name: 'OTHERS - 自动选择', type: 'url-test',
        url: 'http://www.gstatic.com/generate_204', interval: 300,
        proxies: otherProxies, hidden: true,
    } : null;

    const otherManualGroup = otherProxies.length > 0 ? {
        name: '其他 - 手动选择', type: 'select',
        proxies: otherProxies,
    } : null;

    const functionalGroupNames = [
        "AI 服务", "YouTube", "Spotify"
    ];

    const functionalGroups = functionalGroupNames.map(name => ({
        name: name, type: "select", icon: getIconForGroup(name), url: getTestUrlForGroup(name),
        proxies: ["Proxy", "DIRECT", "ALL - 自动选择", ...regionAutoGroups.map(g => g.name), otherAutoGroup ? otherAutoGroup.name : null,].filter(Boolean),
    }));

    const groups = [
        {name: "Proxy", type: "select", proxies: ["♻️ 自动选择", "手动选择", "DIRECT"]},
        {name: "手动选择", type: "select", proxies: allProxies},
        {
            name: "♻️ 自动选择",
            type: "select",
            proxies: ["ALL - 自动选择", ...regionAutoGroups.map(g => g.name), otherAutoGroup ? otherAutoGroup.name : null,].filter(Boolean)
        },
        {
            name: "ALL - 自动选择",
            type: "url-test",
            url: 'http://www.gstatic.com/generate_204',
            interval: 300,
            proxies: allProxies,
            hidden: true
        },
        ...functionalGroups,
        {name: "漏网之鱼", type: "select", icon: getIconForGroup("漏网之鱼"), proxies: ["Proxy", "DIRECT"]},
        {name: "广告拦截", type: "select", icon: getIconForGroup("广告拦截"), proxies: ["REJECT", "DIRECT"]},
        ...regionAutoGroups, ...regionManualGroups,
        otherAutoGroup, otherManualGroup,
    ].filter(Boolean);

    config["proxy-groups"] = groups;
}


const main = (config) => {
    if (!config.proxies || config.proxies.length === 0) return config;
    overwriteRules(config);
    overwriteProxyGroups(config);
    return config;
}
module.exports = main;