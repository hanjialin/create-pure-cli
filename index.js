#!/usr/bin/env node
import {program} from "commander";

import {exec} from "child_process";

import path from "path";

import fs from "fs";

import inquirer from "inquirer";
//定义版本信息
program.version('1.0.0', '-v, --version');
//定义模板选项
const templates = {
    'vue3-vite-naiveui-template': 'https://github.com/hanjialin/vue3-vite-naiveui-template.git',
    'vue3-vite-vant4-template': 'https://github.com/hanjialin/vue3-vite-vant4-template.git'
}

//定义命令和选项

program
    .command('create <projectName>')
    .description('创建一个新的项目')
    .option('-t, --template <templateName>', '指定项目模板')
    .action(async (projectName, options) => {
        let repoUrl;
        if (options.template) {
            repoUrl = templates[options.template];
            if (!repoUrl) {
                console.error(`无效的模板名称: ${options.template}。可用模板: ${Object.keys(templates).join(', ')}`);
                process.exit(1);
            }
        } else {
            const answers = await inquirer.prompt([{
                type: 'list',
                name: 'template',
                message: '请选择一个项目模板:',
                choices: Object.keys(templates)
            }]);
            repoUrl = templates[answers.template];
        }

        const projectDir = path.join(process.cwd(), projectName);

        if (!projectName) {
            console.error('请提供项目名称，例如: create-pure-cli create your-project-name');
            process.exit(1);
        }

        // 创建项目目录
        try {
            fs.mkdirSync(projectDir);
        } catch (error) {
            console.error(`创建项目目录时出错: ${error.message}`);
            process.exit(1);
        }

        // 克隆仓库到项目目录
        const cloneCommand = `git clone ${repoUrl} ${projectDir}`;

        exec(cloneCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`克隆仓库时出错: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`克隆仓库时出错: ${stderr}`);
                return;
            }
            console.log(`成功克隆项目到 ${projectDir}`);
        });
    });

// 解析命令行参数
program.parse(process.argv);