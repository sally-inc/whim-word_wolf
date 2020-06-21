import Vue from "vue";
import App from "./App.vue";
import VueCountdown from "@chenfengyuan/vue-countdown";
import whimClientVue from "whim-client-vue";
import "whim-client-vue/dist/whim-client-vue.css";

Vue.component(VueCountdown.name, VueCountdown);

Vue.config.productionTip = false;

import "./assets/sass/style.scss";

Vue.use(whimClientVue);

const TOPICS = require("@/assets/topics.json");

Vue.prototype.$gameStart = genre => {
  let targetTopics;
  if (genre === "random") {
    targetTopics = TOPICS;
  } else {
    targetTopics = TOPICS.filter(topic => topic.genre === genre);
  }
  const topic = targetTopics[Math.floor(Math.random() * targetTopics.length)];

  let majority, minority;
  if (topic.group) {
    const selected = topic.group.sort(() => 0.5 - Math.random()).slice(0, 2);
    majority = selected[0];
    minority = selected[1];
  } else if (topic.majority && topic.minority) {
    majority = topic.majority;
    minority = topic.minority;
  } else {
    console.error("invalid json");
  }
  let userTopic = {};
  Vue.prototype.$whim.users.map(user => {
    userTopic[user.id] = majority;
  });
  const minorityUserId =
    Vue.prototype.$whim.users[
      Math.floor(Math.random() * Vue.prototype.$whim.users.length)
    ].id;
  userTopic[minorityUserId] = minority;
  Vue.prototype.$whim.assignState({
    genre: genre,
    phase: "shuffling",
    userTopic: userTopic,
    minorityUserId: minorityUserId
  });
  setTimeout(() => {
    Vue.prototype.$whim.assignState({
      phase: "discussing",
      sound: true
    });
  }, 2000);
};

new Vue({
  render: h => h(App)
}).$mount("#app");
