<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input style="width: 200px" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
              <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" size="mini"
                         @click="fetchData()">搜索
              </el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
      <el-button type="danger" class="btn-add" icon="el-icon-delete-solid" size="mini" @click="batchRemove()">批量删除</el-button>
      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        stripe
        border
        style="width: 100%;margin-top: 10px;"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"/>

        <el-table-column
          label="序号"
          width="70"
          align="center">
          <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="roleName" label="角色名称"/>
        <el-table-column prop="roleCode" label="角色编码"/>
        <el-table-column prop="createTime" label="创建时间" width="160"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"
                       title="删除"/>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        :current-page="page"
        :total="total"
        :page-size="limit"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="fetchData"
      />
    </div>

    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName"/>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import api from '@/api/role/role.js'

export default {
  data() {
    return {
      // listLoading: true, //  加载中的提示语.....
      list: [],
      total: 0,
      page: 1,
      limit: 5,
      searchObj: {},
      sysRole: {}, // 封装表单中role角色
      dialogVisible: false, // 给个默认初始化值 隐藏弹框
      selectValueData: []// 选中的数据
    }
  },
  created() {
    this.fetchData(1)
  },
  methods: {
    fetchData(pageNum = 1) {
      this.page = pageNum
      api.getPageList(this.page, this.limit, this.searchObj).then(response => {
        // console.log(response)
        // this.listLoading = false
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    resetData() {
      // 清空表单
      this.searchObj = {}
      // 再次刷新列表数据
      this.fetchData()
    },
    removeDataById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api.removeId(id)
          .then((response) => {
            // 提示
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 刷新页面
            this.fetchData()
          })
      })
    },
    // 打开弹框
    add() {
      // 将 控制弹框的 属性设置为 true
      this.dialogVisible = true
      // 清空表单
      this.sysRole = {}
    },
    // 添加或者修改 具体功能
    saveOrUpdate() {
      if (this.sysRole.id != null) {
        this.updateRole()
      } else {
        this.addRole()
      }
    },
    // 实现添加功能
    addRole() {
      api.saveRole(this.sysRole)
        .then(response => {
          // 给出提示框
          this.$message({
            type: "success",
            message: "添加角色成功!",
          });
          // 关闭添加弹框
          this.dialogVisible = false
          // 再次刷新数据
          this.fetchData()
        })
    },
    // 根据id去回显数据
    edit(id) {
      //1.弹框
      this.dialogVisible = true
      //2.赋值
      api.getRoleById(id)
        .then(response => {
          this.sysRole = response.data
        })
    },
    updateRole() {
      api.updateRole(this.sysRole)
        .then(response => {
          this.$message({
            type: "success",
            message: "修改成功!"
          })
          // 关闭弹框
          this.dialogVisible = false
          // 刷新数据
          this.fetchData()
        })
    },
    batchRemove() {
      // 判断是否有选中select
      if (this.selectValueData.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.selectValueData.length; i++) {
          const obj = this.selectValueData[i]
          // 获取id值
          const id = obj.id
          // 将id放进到数组中
          ids.push(id)
        }
        api.bactchremoveId(ids)
          .then((response) => {
            // 提示
            this.$message({
              type: "success",
              message: "删除成功!"
            })
            // 刷新页面
            this.fetchData()
          })
      }).catch(() => {
        this.$message({
          type: 'primary',
          message: '已取消'
        })
      })
    },
    handleSelectionChange(selectValue) {
      this.selectValueData = selectValue
    },
  }
}
</script>

<style>

</style>
