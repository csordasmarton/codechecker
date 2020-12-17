import Vue from "vue";

import GitBlameLine from "./GitBlameLine";
const GitBlameLineClass = Vue.extend(GitBlameLine);

function getAnnotations(blameInfo) {
  const commits = blameInfo.commits;
  const blame = blameInfo.blame;

  return blame.reduce((acc, curr) => {
    acc[curr.from] = commits[curr.commit];
    acc[curr.from].hexsha = curr.commit;

    for (let i = curr.from + 1; i <= curr.to; ++i) {
      acc[i] = null;
    }

    return acc;
  }, {});
}

export default {
  data() {
    return {
      gutterID: "blame-gutter"
    };
  },
  methods: {
    hideBlameView(editor) {
      editor.clearGutter(this.gutterID);
      editor.setOption("gutters", []);
      editor.setOption("lineNumbers", true);
    },

    loadBlameView(editor, sourceFile) {
      editor.setOption("gutters", [ this.gutterID ]);
      editor.setOption("lineNumbers", false);

      const blameInfo = JSON.parse(sourceFile.blameInfo);
      const annotations = getAnnotations(blameInfo);

      editor.operation(() => {
        for (let i = 0; i < editor.lineCount(); ++i) {
          const widget = new GitBlameLineClass({
            propsData: {
              number: i + 1,
              commit: annotations[i + 1]
            }
          });

          // This is needed otherwise it will throw an error.
          widget.$vuetify = this.$vuetify;

          widget.$mount();

          editor.setGutterMarker(i, this.gutterID, widget.$el);
        }

        editor.refresh();
      });
    }
  }
};
