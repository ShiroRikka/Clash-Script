// run.js

// 1. 引入必要的模块
const fs = require("fs"); // Node.js 内置的文件系统模块
const yaml = require("js-yaml"); // 刚才安装的 yaml 解析库
const main = require("./script.js"); // 引入我们自己写的脚本

// 2. 定义输入和输出文件名
const inputFile = "Proxies.yaml";
const outputFile = "processed_config.yaml";

try {
  // 3. 读取并解析 YAML 文件
  const fileContent = fs.readFileSync(inputFile, "utf8");
  const config = yaml.load(fileContent);

  console.log(`成功加载 ${inputFile}`);

  // 4. 调用 main 函数处理配置
  const processedConfig = main(config);

  console.log("脚本处理完成");

  // 5. 将处理后的对象转换回 YAML 格式并写入新文件
  const yamlString = yaml.dump(processedConfig, {
    indent: 2,
    lineWidth: -1, // 避免自动换行
    noRefs: true, // 避免使用锚点和别名
    sortKeys: false, // 保持键的顺序
  });

  fs.writeFileSync(outputFile, yamlString, "utf8");

  console.log(`处理后的配置已保存到 ${outputFile}`);
} catch (e) {
  console.error("处理过程中发生错误:", e);
}
