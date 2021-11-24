<template>
  <div v-if="dataReady" class="sidebar-container">
    <div id="sidebar-title" class="sidebar-title">
      <h3>{{ title }}</h3>
    </div>

    <ul class="links">
      <li
        v-for="(link, inx) in links"
        :key="inx"
        :class="{
          current: link.current,
          disabled: link.disabled,
          separate: link.separate
        }"
        @keydown="keyDown($event, link)"
        @click="activateLink(link)"
        :tabindex="link.disabled ? '-1' : '0'"
      >
        <div class="link-icon">{{ link.textIndex }}</div>
        <div class="link-label">{{ link.title }}</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class SandboxSidebar extends Vue {
  @Prop({ required: true })
  survey!: any;

  @Prop({ required: true })
  changed!: number;

  title = "";
  links = [];

  dataReady = false;

  @Watch("changed")
  pageIndexChange(newVal) {
    this.updateContent();
  }

  mounted() {
    this.dataReady = false;
    this.updateContent();
    this.dataReady = true;
  }

  public updateContent() {
    if (this.survey) {
      this.title = "Application Steps"; // model.title;
      const links = [];
      this.survey.visiblePages.forEach((page, idx) => {
        links.push({
          disabled: false,
          index: idx,
          textIndex: "" + (idx + 1),
          title: page.processedTitle || page.name,
          current: idx === this.survey.currentPageNo
        });
      });
      this.links = links;
    }
  }

  public changePage(pageNo: number) {
    this.survey.currentPageNo = pageNo;
    this.updateContent();
  }

  public activateLink(link: any) {
    if (link && !link.disabled) {
      if (link.special) this.survey.changeMode(link.special);
      else this.changePage(link.index);
    }
  }

  keyDown(event, link) {
    // allow space or enter to activate page
    if (event && (event.keyCode === 13 || event.keyCode === 32)) this.activateLink(link);
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/_common";

/* // outer sidebar */
.sidebar-container {
  background: #eee;
  border-right: 2px solid #ddd;
  bottom: 0;
  display: block;
  left: 0;
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 0;
  top: 0;
  width: $sidebar-width-md;
  min-width: 250px;
}
@include media-breakpoint-up(lg) {
  .sidebar-container {
    width: $sidebar-width-lg;
  }
}

/* // sidebar title */
.sidebar-title {
  padding: 1rem 2rem 1.5rem;
  h3 {
    margin: 0;
  }
}

/* // Sidebar Nav */

$link-active-color: #349;
$link-current-color: $gov-white;
$link-hover-color: #57d;
$link-disabled-color: #777;

.links {
  display: block;
  list-style-type: none;
  margin: 0;
  max-width: 100%;
  padding: 0;
  li {
    cursor: pointer;
    display: flex;
    flex-flow: row;
    list-style-type: none;
    margin: 0;
    padding: 0.15rem 1em 0.75rem 1em;
    &.disabled {
      cursor: not-allowed;
    }
    &:not(.current):not(:active):not(:focus):not(.disabled):hover {
      .link-icon {
        border-color: $link-hover-color;
        color: $link-hover-color;
      }
      .link-label {
        color: $link-hover-color;
      }
    }
    &:active,
    &:focus {
      .link-icon {
        border-color: $link-active-color;
        color: $link-active-color;
        font-weight: bold;
      }
      .link-label {
        color: $link-active-color;
      }
    }
    &.current {
      background: $gov-gold;
      .link-icon {
        border-color: $link-current-color;
        color: $link-current-color;
        font-weight: bold;
      }
      .link-label {
        color: $link-current-color;
      }
    }
    &.disabled {
      .link-icon {
        border-color: $link-disabled-color;
        color: $link-disabled-color;
      }
      .link-label {
        color: $link-disabled-color;
      }
    }
    &.separate {
      margin-top: 1em;
      &::before {
        display: block;
        content: " ";
        margin: 0 1.5em;
        position: relative;
        top: -0.75em;
        height: 1px;
        background: #25b;
        width: 100%;
      }
    }
  }
}

.link-icon {
  position: relative;
  top: 0.25em;
  border: 2px solid $text-color-link;
  border-radius: 50%;
  color: $text-color-link;
  font-size: 20px;
  flex: none;
  height: 32px;
  line-height: 28px;
  width: 32px;
  text-align: center;
  transition: border-color color 0.1s linear;
  font-variant-numeric: tabular-nums;
}
.link-icon.fa {
  line-height: 23px;
  padding-left: 2px;
}

.link-label {
  font-size: 1.1em;
  color: $text-color-link;
  padding-left: 10px;
  padding-top: 5px;
  transition: color 0.1s linear;
}
</style>
