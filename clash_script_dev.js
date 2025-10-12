/**
 * 资深工程师优化后的 Clash 配置预处理器
 *
 * 优化点：
 * 1. 可维护性：将配置项抽离，函数职责单一化，使用工厂模式减少重复代码。
 * 2. 性能：优化节点分类算法，从多次遍历改为单次遍历。
 * 3. 健壮性：改进“其他节点”的识别逻辑，使其更可靠；代理组显式指定节点列表。
 */
function main(config) {
  // --- 1. 集中化配置管理 ---
  // 所有可变参数、硬编码字符串和常量都放在这里，便于维护
  const APP_CONFIG = {
    // 代理组名称
    GROUP_NAMES: {
      SELECTOR: "节点选择",
      URL_TEST: "自动选择",
      FALLBACK: "手动切换", // "手动切换"本质上是所有节点的选择器
      OTHER: "其他节点",
      AD_BLOCK: "广告拦截",
      APP_CLEAN: "应用净化",
      FINAL: "漏网之鱼",
      GLOBAL: "GLOBAL",
    },
    // 通用图标
    ICONS: {
      SELECTOR:
        "https://testingcf.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
      URL_TEST:
        "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png",
      FALLBACK:
        "https://testingcf.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png",
      OTHER:
        "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
      AD_BLOCK:
        "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/AdBlack.png",
      APP_CLEAN:
        "https://testingcf.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/guard.svg",
      FINAL:
        "https://testingcf.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg",
      GLOBAL:
        "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Global.png",
    },
    // 测速规则
    URL_TEST_CONFIG: {
      interval: 300,
      tolerance: 50,
    },
    // 规则集更新间隔
    RULE_INTERVAL: 86400,
    // 地区过滤器配置
    regionFilters: {
      // ... (此部分内容与原代码相同，保持不变)
      美国节点: {
        icon: "https://testingcf.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg",
        filter: "(?i)美|硅谷|拉斯维加斯|西雅图|芝加哥|US|United States",
      },
      日本节点: {
        icon: "https://testingcf.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg",
        filter: "(?i)日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan",
      },
      // ... 其他地区配置
      新加坡节点: {
        /* ... */
      },
      香港节点: {
        /* ... */
      },
      台湾节点: {
        /* ... */
      },
      中国节点: {
        /* ... */
      },
      加拿大节点: {
        /* ... */
      },
      德国节点: {
        /* ... */
      },
      法国节点: {
        /* ... */
      },
      俄罗斯节点: {
        /* ... */
      },
      韩国节点: {
        /* ... */
      },
      联合国节点: {
        /* ... */
      },
      英国节点: {
        /* ... */
      },
      印度节点: {
        /* ... */
      },
      荷兰节点: {
        /* ... */
      },
      越南节点: {
        /* ... */
      },
      伊朗节点: {
        /* ... */
      },
    },
    // 规则提供者配置
    ruleProviders: {
      // ... (此部分内容与原代码相同，保持不变)
      LocalAreaNetwork: {
        type: "http",
        behavior: "classical",
        url: "https://testingcf.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash/LocalAreaNetwork.list",
        path: "./ruleset/LocalAreaNetwork.list",
        interval: 86400,
      },
      UnBan: {
        /* ... */
      },
      BanAD: {
        /* ... */
      },
      BanProgramAD: {
        /* ... */
      },
      ProxyGFWlist: {
        /* ... */
      },
      ChinaDomain: {
        /* ... */
      },
      ChinaCompanyIp: {
        /* ... */
      },
      Download: {
        /* ... */
      },
    },
  };

  // --- 2. 功能模块化 ---

  /**
   * 编译地区过滤器的正则表达式
   * @returns {Object} 编译后的地区过滤器对象
   */
  const compileRegionFilters = () => {
    const compiled = {};
    for (const [regionName, regionConfig] of Object.entries(
      APP_CONFIG.regionFilters
    )) {
      const pattern = regionConfig.filter.replace(/\(\?i\)/g, "");
      compiled[regionName] = {
        ...regionConfig,
        regex: new RegExp(pattern, "i"),
      };
    }
    return compiled;
  };

  /**
   * 单次遍历对所有代理进行分类
   * @param {Array} allProxies 所有代理节点
   * @param {Object} compiledFilters 编译后的过滤器
   * @returns {Object} 分类结果: { regionProxies, otherProxies, availableRegions }
   */
  const categorizeProxies = (allProxies, compiledFilters) => {
    const regionProxies = {};
    const otherProxies = [];

    // 初始化每个地区的代理列表
    for (const regionName of Object.keys(compiledFilters)) {
      regionProxies[regionName] = [];
    }

    // 单次遍历，为每个代理打上地区标签
    for (const proxy of allProxies) {
      let matchedRegions = [];
      for (const [regionName, regionData] of Object.entries(compiledFilters)) {
        if (regionData.regex.test(proxy.name)) {
          matchedRegions.push(regionName);
        }
      }

      if (matchedRegions.length > 0) {
        // 如果匹配到地区，则加入对应地区列表
        matchedRegions.forEach((region) =>
          regionProxies[region].push(proxy.name)
        );
      } else {
        // 否则归为“其他”
        otherProxies.push(proxy.name);
      }
    }

    // 筛选出确实有节点的地区
    const availableRegions = Object.keys(regionProxies).filter(
      (region) => regionProxies[region].length > 0
    );

    return { regionProxies, otherProxies, availableRegions };
  };

  /**
   * 代理组工厂函数，减少代码重复
   * @param {string} name 代理组名
   * @param {string} icon 图标URL
   * @param {string} type 类型
   * @param {Object} props 其他属性
   * @returns {Object} 代理组对象
   */
  const createProxyGroup = (name, icon, type, props = {}) => {
    return {
      name,
      icon,
      type,
      ...props,
    };
  };

  /**
   * 创建所有代理组
   * @param {Object} categorizedProxies 分类后的代理数据
   * @returns {Array} 代理组数组
   */
  const createProxyGroups = ({
    regionProxies,
    otherProxies,
    availableRegions,
  }) => {
    const proxyGroups = [];
    const hasOtherNodes = otherProxies.length > 0;
    const commonFallbackProxies = [
      APP_CONFIG.GROUP_NAMES.URL_TEST,
      APP_CONFIG.GROUP_NAMES.FALLBACK,
      "DIRECT",
    ];

    // 1. 节点选择
    proxyGroups.push(
      createProxyGroup(
        APP_CONFIG.GROUP_NAMES.SELECTOR,
        APP_CONFIG.ICONS.SELECTOR,
        "select",
        {
          proxies: [
            ...availableRegions,
            ...(hasOtherNodes ? [APP_CONFIG.GROUP_NAMES.OTHER] : []),
            ...commonFallbackProxies,
          ],
        }
      )
    );

    // 2. 自动选择
    proxyGroups.push(
      createProxyGroup(
        APP_CONFIG.GROUP_NAMES.URL_TEST,
        APP_CONFIG.ICONS.URL_TEST,
        "url-test",
        { "include-all": true, ...APP_CONFIG.URL_TEST_CONFIG }
      )
    );

    // 3. 手动切换
    proxyGroups.push(
      createProxyGroup(
        APP_CONFIG.GROUP_NAMES.FALLBACK,
        APP_CONFIG.ICONS.FALLBACK,
        "select",
        { "include-all": true }
      )
    );

    // 4. 各地区节点组 - 显式指定代理列表
    for (const regionName of availableRegions) {
      const regionConfig = APP_CONFIG.regionFilters[regionName];
      proxyGroups.push(
        createProxyGroup(regionName, regionConfig.icon, "url-test", {
          proxies: regionProxies[regionName],
          ...APP_CONFIG.URL_TEST_CONFIG,
        })
      );
    }

    // 5. 其他节点
    if (hasOtherNodes) {
      proxyGroups.push(
        createProxyGroup(
          APP_CONFIG.GROUP_NAMES.OTHER,
          APP_CONFIG.ICONS.OTHER,
          "url-test",
          { proxies: otherProxies, ...APP_CONFIG.URL_TEST_CONFIG }
        )
      );
    }

    // 6. 广告拦截 / 应用净化
    const rejectGroupsProxies = [
      "REJECT",
      "DIRECT",
      APP_CONFIG.GROUP_NAMES.SELECTOR,
    ];
    proxyGroups.push(
      createProxyGroup(
        APP_CONFIG.GROUP_NAMES.AD_BLOCK,
        APP_CONFIG.ICONS.AD_BLOCK,
        "select",
        { proxies: rejectGroupsProxies }
      )
    );
    proxyGroups.push(
      createProxyGroup(
        APP_CONFIG.GROUP_NAMES.APP_CLEAN,
        APP_CONFIG.ICONS.APP_CLEAN,
        "select",
        { proxies: rejectGroupsProxies }
      )
    );

    // 7. 漏网之鱼
    proxyGroups.push(
      createProxyGroup(
        APP_CONFIG.GROUP_NAMES.FINAL,
        APP_CONFIG.ICONS.FINAL,
        "select",
        {
          proxies: [
            ...availableRegions,
            ...(hasOtherNodes ? [APP_CONFIG.GROUP_NAMES.OTHER] : []),
            ...commonFallbackProxies,
          ],
        }
      )
    );

    // 8. GLOBAL
    const globalProxies = [
      APP_CONFIG.GROUP_NAMES.SELECTOR,
      APP_CONFIG.GROUP_NAMES.URL_TEST,
      APP_CONFIG.GROUP_NAMES.FALLBACK,
      ...availableRegions,
    ];
    if (hasOtherNodes) globalProxies.push(APP_CONFIG.GROUP_NAMES.OTHER);
    globalProxies.push(
      APP_CONFIG.GROUP_NAMES.AD_BLOCK,
      APP_CONFIG.GROUP_NAMES.APP_CLEAN,
      APP_CONFIG.GROUP_NAMES.FINAL
    );

    proxyGroups.push(
      createProxyGroup(
        APP_CONFIG.GROUP_NAMES.GLOBAL,
        APP_CONFIG.ICONS.GLOBAL,
        "select",
        { proxies: globalProxies }
      )
    );

    return proxyGroups;
  };

  // --- 3. 主流程 ---
  const allProxies = config.proxies || [];

  // 步骤1: 编译过滤器
  const compiledFilters = compileRegionFilters();

  // 步骤2: 分类代理
  const categorizedProxies = categorizeProxies(allProxies, compiledFilters);

  // 步骤3: 创建代理组
  config["proxy-groups"] = createProxyGroups(categorizedProxies);

  // 步骤4: 配置规则提供者
  config["rule-providers"] = APP_CONFIG.ruleProviders;

  // 步骤5: 配置规则
  config["rules"] = [
    "RULE-SET,LocalAreaNetwork,DIRECT",
    "RULE-SET,UnBan,DIRECT",
    `RULE-SET,BanAD,${APP_CONFIG.GROUP_NAMES.AD_BLOCK}`,
    `RULE-SET,BanProgramAD,${APP_CONFIG.GROUP_NAMES.APP_CLEAN}`,
    `RULE-SET,ProxyGFWlist,${APP_CONFIG.GROUP_NAMES.SELECTOR}`,
    "RULE-SET,ChinaDomain,DIRECT",
    "RULE-SET,ChinaCompanyIp,DIRECT",
    "RULE-SET,Download,DIRECT",
    "GEOIP,CN,DIRECT",
    `MATCH,${APP_CONFIG.GROUP_NAMES.FINAL}`,
  ];

  return config;
}
