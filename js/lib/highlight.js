mixins.highlight = {
    data() {
        return { copying: false };
    },
    created() {
        hljs.configure({ ignoreUnescapedHTML: true });
        this.renderers.push(this.highlight);
    },
    methods: {
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        /**
         * 从 class 列表中提取语言名称
         * @param {DOMTokenList} classList - 元素的 class 列表
         * @returns {string} 提取到的语言名称，默认为 plaintext
         */
        extractLanguage(classList) {
            for (let cls of classList) {
                if (cls.startsWith("language-")) {
                    return cls.replace("language-", "");
                }
                if (cls.startsWith("lang-")) {
                    return cls.replace("lang-", "");
                }
            }
            return "plaintext";
        },
        /**
         * 对页面中所有代码块进行语法高亮处理
         * 包括：高亮代码、添加语言标签、添加复制按钮、添加行号
         */
        highlight() {
            let codes = document.querySelectorAll("pre");
            for (let i of codes) {
                let codeEl = i.querySelector("code");
                let code = codeEl ? codeEl.textContent : i.textContent;
                let language = this.extractLanguage(codeEl ? codeEl.classList : i.classList);
                let highlighted;
                try {
                    highlighted = hljs.highlight(code, { language }).value;
                } catch {
                    highlighted = code;
                }
                i.innerHTML = `
                <div class="code-content hljs">${highlighted}</div>
                <div class="language">${language}</div>
                <div class="copycode">
                    <i class="fa-solid fa-copy fa-fw"></i>
                    <i class="fa-solid fa-check fa-fw"></i>
                </div>
                `;
                let content = i.querySelector(".code-content");
                hljs.lineNumbersBlock(content, { singleLine: true });
                let copycode = i.querySelector(".copycode");
                copycode.addEventListener("click", async () => {
                    if (this.copying) return;
                    this.copying = true;
                    copycode.classList.add("copied");
                    await navigator.clipboard.writeText(code);
                    await this.sleep(1000);
                    copycode.classList.remove("copied");
                    this.copying = false;
                });
            }
        },
    },
};
