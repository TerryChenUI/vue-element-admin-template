<template>
  <div class="upload-container">
    <el-button
      :style="{
        background: color,
        borderColor: color
      }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
      >上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class EditorImage extends Vue {
  @Prop({
    default: '#1890ff'
  })
  color!: string

  dialogVisible: boolean = false
  listObj: any = {}
  fileList: any[] = []

  checkAllSuccess() {
    return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
  }

  handleSubmit() {
    const arr = Object.keys(this.listObj).map(v => this.listObj[v])
    if (!this.checkAllSuccess()) {
      this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
      return
    }
    this.$emit('successCBK', arr)
    this.listObj = {}
    this.fileList = []
    this.dialogVisible = false
  }

  handleSuccess(response, file) {
    const uid = file.uid
    const objKeyArr = Object.keys(this.listObj)
    for (let i = 0, len = objKeyArr.length; i < len; i++) {
      if (this.listObj[objKeyArr[i]].uid === uid) {
        this.listObj[objKeyArr[i]].url = response.files.file
        this.listObj[objKeyArr[i]].hasSuccess = true
        return
      }
    }
  }

  handleRemove(file) {
    const uid = file.uid
    const objKeyArr = Object.keys(this.listObj)
    for (let i = 0, len = objKeyArr.length; i < len; i++) {
      if (this.listObj[objKeyArr[i]].uid === uid) {
        delete this.listObj[objKeyArr[i]]
        return
      }
    }
  }

  beforeUpload(file) {
    const that = this
    const URL_VAL = window.URL || window.webkitURL
    const fileName = file.uid
    this.listObj[fileName] = {}
    return new Promise(resolve => {
      const img = new Image()
      img.src = URL_VAL.createObjectURL(file)
      /* tslint:disable */
      img.onload = function() {
        that.listObj[fileName] = {
          hasSuccess: false,
          uid: file.uid,
          width: (this as any).width,
          height: (this as any).height
        }
      }
      resolve(true)
    })
  }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
