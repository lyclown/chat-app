<template>
    <div class="wrap">
        <van-button @click="handleClick">解析文本</van-button>
    </div>
</template>
    
<script>
export default {
    data() {
        return {
            htmlT: `
            <td ng-if="search.policyNoCIs||search.policyNoBIs" style="padding: 0px;">
                      <a href ng-if="search.policyNoCIs" ng-click="BusinessViews(search,'readonly')"
                        style="text-decoration:underline">
                        <img src="assets/img/jiao.jpg" style="position: relative; top: -1px" />
                        {{search.policyNoCIs}}
                      </a><br />
                      <a href ng-if="search.policyNoBIs" ng-click="BusinessViews(search,'readonly')"
                        style="text-decoration:underline">
                        <img src="assets/img/shang.jpg" style="position: relative; top: -1px" />
                        {{search.policyNoBIs}}
                      </a>
                    </td>
            `
        }
    },
    mounted() {
    },
    methods: {
        async handleClick() {
            const dom = document.createElement('div');
            dom.innerHTML = this.htmlT
            const ndoeObj = this.convertHtmlToTree(dom)
            this.convertTreeToHtml(ndoeObj)
            // const { data } = await axios.post("http://127.0.0.1:3000/stream/answer", { prompt: currentQuestion })
            // if (data.success) {
            //     this.$toast('完成')
            //     this.questionIndex++
            //     window.sessionStorage.setItem('cahtGpt', JSON.stringify(this.questionsAnswers))
            // }
        },
        async convertTreeToHtml(tree) {
            var html = "";
            var attributes = "";
            for (var attr in tree.attributes) {
                attributes += " " + attr + "=\"" + tree.attributes[attr] + "\"";
            }
            html += "<" + tree.tagName + " id=\"" + tree.id + "\"" + attributes + ">";
            for (var i = 0; i < tree.childrens.length; i++) {
                html += this.convertTreeToHtml(tree.childrens[i]);
            }
            html += "</" + tree.tagName + ">";
            return html;
        },
        traverseNode(node) {
            // 获取节点的标签名以及所有属性
            if (!node.tagName) return []
            const tagName = node.tagName.toLowerCase();
            const attrs = node.attributes;
            const attrStr = Array.from(attrs).map(attr => `${attr.name}="${attr.value}"`).join(' ');

            // 返回当前节点的标签内容（不包括子节点）
            return `<${tagName} ${attrStr}></${tagName}>`;
        },
        async convertHtmlToTree(obj) {
            console.log(obj, 1)
            var node = {
                id: "",
                tagName: "",
                attributes: {},
                childrens: [],
                nodeText: this.traverseNode(obj),
            };
            node.id = obj.getAttribute("id");
            node.tagName = obj.tagName.toLowerCase();
            var attributes = obj.attributes;
            console.log(attributes)
            for (var i = 0; i < attributes.length; i++) {
                
                node.attributes[attributes[i].nodeName] = attributes[i].nodeValue;
            }
            var children = obj.childNodes;
            for (var s = 0; s < children.length; s++) {
                if (children[s].nodeType === 1) {
                    var childNode = this.convertHtmlToTree(children[s]);
                    node.childrens.push(childNode);
                }
            }
            return node;
        }
    }
}
</script>
<style scoped>
.wrap {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 10px;
    box-sizing: border-box;
}

.content {
    flex: 1;
    overflow-y: auto;
}

.footer {
    display: flex;
    align-items: center;
    height: 60px;
    background-color: #fff;
    border-radius: 10px;
}

.question {
    display: flex;
    width: 100%;
    background-color: #343541;
    color: #fff;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
}

.answer {
    display: flex;
    width: 100%;
    background-color: #444654;
    color: #fff;
}

.answer pre {
    display: flex;
    justify-content: center;
}

.answer pre code {
    /* width: 800px; */
}

.ml-20 {
    margin-left: 8px;
}

.mt-17 {
    margin-top: 17px;
}

.ml-7 {
    margin-left: 7px;
}

.ml-4 {
    margin-left: 4px;
}

.ofx-auto {
    overflow-x: auto;
}

.jc-sb {
    justify-content: space-between;
}

.ti-center {
    text-align: center;
}

.c-pointer {
    cursor: pointer;
}

.flex {
    display: flex;
}

.ai-center {
    align-items: center;
}

.jc-center {
    justify-content: center;
}
</style>

