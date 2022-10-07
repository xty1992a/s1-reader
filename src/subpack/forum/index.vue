<template>
  <IPage>
    <div class="page-forum">
      <div class="picked">

        <nut-cell-group title="已选" class="picked-block">
          <SorterContainer style="width: 100%;" class="box-wrap1" @change="onSwap" :list="thread.forumList.map(i => i.fid)">
            <SorterItem v-for="(it, index) in thread.forumList" :key="it.fid" :index="index" class="box1">
              <nut-cell :title="it.name" style="margin: 0;"  />
<!--              {{it.name}}-->
            </SorterItem>
          </SorterContainer>
        </nut-cell-group>

        <nut-cell-group title="已选">
          <nut-cell
            v-for="it in thread.forumList"
            :key="it.fid"
            :title="it.name"
          >
            <template #link>
              <div class="set-block">
                <nut-icon
                  name="arrow-up"
                  @click="thread.stepForum(it, -1)"
                ></nut-icon>
                <nut-icon
                  name="arrow-down"
                  @click="thread.stepForum(it, 1)"
                ></nut-icon>
                <nut-icon
                  name="close-little"
                  @click="thread.delForum(it)"
                ></nut-icon>
              </div>
            </template>
          </nut-cell>
        </nut-cell-group>
        <nut-cell-group title="待选">
          <nut-cell v-for="it in unpick" :key="it.fid" :title="it.name">
            <template #link>
              <nut-checkbox @change="onPick(it)" />
            </template>
          </nut-cell>
        </nut-cell-group>
      </div>
    </div>
  </IPage>
</template>

<script lang="ts">
export default {
  name: "PageForum",
};
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getForumList } from "@/api";
import { forum } from "@/types";
import { useThread } from "@/store";
import SorterContainer from '@/components/sorter/SorterContainer.vue'
import SorterItem from '@/components/sorter/SorterItem.vue'

const thread = useThread();

const allList = ref<forum.ForumOption[]>([]);

onMounted(() => {
  getForumList().then((res) => {
    if (!res.success) return;
    allList.value = res.data;
  });
});

const unpick = computed(() => {
  const picked = thread.forumList.map((i) => i.fid);
  return allList.value.filter((it) => !picked.includes(it.fid));
});

const onPick = (option: forum.ForumOption) => {
  thread.addForum(option);
};

const delOption = thread.delForum;
const stepOption = (item: forum.ForumOption, delta: number) => {
  thread.stepForum(item, delta);
};
const onSwap = (e) => {
thread.swapForum(e.source, e.target)
}

definePageConfig({
  navigationBarTitleText: "版块",
});
</script>

<style lang="less">
.page-forum {
  .set-block {
    .nut-icon {
      margin-left: 15px;
    }
  }

  .box-wrap{
    display: flex;
    flex-wrap: wrap;
    .box{
      width: 100px;
      height: 100px;
      background-color: #fff;
    }
  }


  .picked-block{
    .nut-cell-group__warp{
      background-color: var(--bg-color);
      overflow: visible;
    }
  }
}
</style>
