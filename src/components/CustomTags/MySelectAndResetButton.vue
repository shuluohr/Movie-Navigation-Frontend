<template>
  <div>
    <el-button type="primary" icon="el-icon-search" size="mini"
               @click="fetchData()">搜索
    </el-button>
    <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
  </div>
</template>

<script>
export default {
  props: ['searchObj', 'fetchData', 'resetData']
}

</script>

