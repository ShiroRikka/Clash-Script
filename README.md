# Clash Script

一个用于配置 Clash Verge 的 JavaScript 脚本，自动生成代理组和规则配置。

## 功能特性

- 🌍 **智能地区分组**：自动识别并按地区分组代理节点（美国、日本、新加坡、香港、台湾等）
- 🚀 **多种负载均衡策略**：支持轮询、哈希、粘滞会话等负载均衡模式
- 📊 **自动选择最佳节点**：基于延迟测试自动选择最优代理
- 🛡️ **广告拦截与应用净化**：集成规则集，拦截广告和恶意应用
- 🔄 **规则自动更新**：从 GitHub 仓库定期更新规则集
- 🎨 **图标美化**：为各个代理组配置对应的国旗和功能图标

## 项目结构

```
Clash-Script/
├── clash_script_custom.js    # 主配置脚本
├── package.json              # 项目配置文件
├── dev/
│   ├── run.js               # 脚本运行器
│   ├── script.js            # 脚本入口文件
│   └── sample.js            # 示例文件
└── README.md                # 项目说明文档
```

## 安装依赖

```bash
npm install
```

## 测试方法

1. 准备一个名为 `Proxies.yaml` 的 Clash 配置文件，包含代理节点信息

2. 运行脚本处理配置：

```bash
node dev/run.js
```

## 使用方法

1. 将内容复制并粘贴至 Clash Verge 的全局拓展脚本中

2. 在 FlClash 配置中通过 URL 导入：https://cdn.jsdelivr.net/gh/ShiroRikka/Clash-Script@main/clash_script_custom.js

## 支持的地区分组

| 地区            | 包含节点                              | 图标 |
| --------------- | ------------------------------------- | ---- |
| 🇺🇸 美国节点     | 美、波特兰、US、United States         | 🇺🇸   |
| 🇯🇵 日本节点     | 日本、川日、东京、大阪、JP、Japan     | 🇯🇵   |
| 🇸🇬 新加坡节点   | 新加坡、坡、狮城、SG、Singapore       | 🇸🇬   |
| 🇭🇰 香港节点     | 港、HK、Hong Kong、HongKong           | 🇭🇰   |
| 🇹🇼 台湾节点     | 台、新北、彰化、TW、Taiwan            | 🇹🇼   |
| 🇨🇦 加拿大节点   | CA、Canada、加拿大、多伦多、温哥华    | 🇨🇦   |
| 🇩🇪 德国节点     | DE、Germany、德国、法兰克福           | 🇩🇪   |
| 🇫🇷 法国节点     | FR、France、法国、巴黎                | 🇫🇷   |
| 🇷🇺 俄罗斯节点   | RU、Russia、俄罗斯、莫斯科            | 🇷🇺   |
| 🇰🇷 韩国节点     | KR、Korea、韩国、首尔                 | 🇰🇷   |
| 🇬🇧 英国节点     | UK、GB、United Kingdom、英国、伦敦    | 🇬🇧   |
| 🇮🇳 印度节点     | IND、India、印度、孟买                | 🇮🇳   |
| 🇳🇱 荷兰节点     | NL、Netherlands、荷兰、阿姆斯特丹     | 🇳🇱   |
| 🇻🇳 越南节点     | VN、Vietnam、越南                     | 🇻🇳   |
| 🇮🇷 伊朗节点     | IR、Iran、伊朗、德黑兰                | 🇮🇷   |
| 🇦🇺 澳大利亚节点 | AU、Australia、澳大利亚、悉尼、墨尔本 | 🇦🇺   |
| 🇸🇪 瑞典节点     | SE、Sweden、瑞典、斯德哥尔摩          | 🇸🇪   |

## 代理组说明

### 全局策略组

- **节点选择**：手动选择地区或策略
- **自动选择**：自动选择延迟最低的节点
- **自动回退**：按顺序选择可用节点
- **负载均衡-轮询**：轮询方式分散流量
- **负载均衡-哈希**：基于一致性哈希分散流量
- **负载均衡-粘滞**：保持会话粘性的负载均衡
- **手动切换**：手动选择具体节点

### 功能策略组

- **广告拦截**：拦截广告域名
- **应用净化**：拦截恶意应用
- **漏网之鱼**：处理未匹配规则的流量

## 规则集

脚本集成了以下规则集（自动从 GitHub 更新）：

- **LocalAreaNetwork**：局域网流量直连
- **UnBan**：解除屏蔽规则
- **BanAD**：广告拦截规则
- **BanProgramAD**：程序广告拦截规则
- **ProxyGFWlist**：代理规则列表
- **ChinaDomain**：中国域名规则
- **ChinaCompanyIp**：中国公司 IP 规则
- **Download**：下载规则

## 配置示例

输入的 `Proxies.yaml` 文件应包含基本的代理节点信息：

```yaml
proxies:
  - name: "美国-01"
    type: ss
    server: us.example.com
    port: 443
    cipher: aes-256-gcm
    password: password
  - name: "日本-东京-01"
    type: vmess
    server: jp.example.com
    port: 443
    uuid: uuid-here
    alterId: 0
    cipher: auto
```

## 输出说明

处理后的 `processed_config.yaml` 将包含：

1. **完整的代理组配置**：按地区分组的代理组
2. **规则提供者**：自动更新的规则集配置
3. **规则列表**：流量分流规则
4. **图标配置**：美观的图标显示

## 依赖项

- `js-yaml`: YAML 文件解析库

## 许可证

GPL-3.0 License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 相关链接

- [Clash Verge](https://github.com/zzzgydi/clash-verge)
- [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules)
- [ACL4SSR/ACL4SSR](https://github.com/ACL4SSR/ACL4SSR)
- [chen08209/FlClash](https://github.com/chen08209/FlClash)
