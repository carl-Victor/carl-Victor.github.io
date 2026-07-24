const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
            activeYear: null,
            themeMode: "auto",
        };
    },
    created() {
        this.initTheme();
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
        this.render();
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            this.scrollTop = newScrollTop;
        },
        /**
         * 切换归档页面的年份显示状态
         * @param {number} year - 要切换的年份
         */
        toggleYear(year) {
            this.activeYear = this.activeYear === year ? null : year;
        },
        /**
         * 初始化主题模式，从 localStorage 读取或使用默认值
         */
        initTheme() {
            const savedTheme = localStorage.getItem("theme-mode");
            if (savedTheme && ["light", "dark", "auto"].includes(savedTheme)) {
                this.themeMode = savedTheme;
            }
            this.applyTheme();
        },
        /**
         * 切换主题模式：auto -> light -> dark -> auto
         */
        toggleTheme() {
            const modes = ["auto", "light", "dark"];
            const currentIndex = modes.indexOf(this.themeMode);
            this.themeMode = modes[(currentIndex + 1) % modes.length];
            localStorage.setItem("theme-mode", this.themeMode);
            this.applyTheme();
        },
        /**
         * 应用主题样式到 document.documentElement
         */
        applyTheme() {
            const root = document.documentElement;
            root.classList.remove("theme-light", "theme-dark", "theme-auto");
            root.classList.add(`theme-${this.themeMode}`);
        },
    },
});
app.mount("#layout");
