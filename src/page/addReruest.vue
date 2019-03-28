<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
          <el-col :span="12" :offset="4">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="110px" class="demo-formData">
              <!--<el-form-item label="项目名称" prop="name">-->
                <!--<el-input v-model="formData.name"></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="用例名称" prop="name">
                <el-input v-model="formData.project_name"></el-input>
              </el-form-item>
              <el-form-item label="所属项目" prop="belong_project">
                <el-input v-model="formData.responsible_name"></el-input>
              </el-form-item>
              <el-form-item label="所属模块" prop="belong_module">
                <el-input v-model="formData.test_user"></el-input>
              </el-form-item>
              <el-form-item label="config/test" prop="include">
                <el-input v-model="formData.dev_user"></el-input>
              </el-form-item>
              <el-form-item label="编写人员" prop="author">
                <el-input v-model="formData.publish_app"></el-input>
              </el-form-item>
              <el-form-item label="请求信息" prop="request">
                <el-input v-model="formData.simple_desc" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <!--<el-input v-model="formData.status"></el-input>-->
                <el-radio-group v-model="formData.status" type="number">
                  <el-radio label=1></el-radio>
                  <el-radio label=0></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="button_submit">
                <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
    </div>
</template>

<script>
// export default {
//   name: 'addshop',
// }
// import headTop from '@/components/headTop'
import {cityGuess, addProject, searchplace, foodCategory} from '@/api/getData'
import {baseUrl, baseImgPath} from '@/config/env'
export default {
  data () {
    return {
      formData: {
        project_name: 'sdssdds', // 项目名称
        responsible_name: 'dsasads', // 项目负责人
        test_user: 'sssdasds', // 测试人员
        dev_user: 'dsdasds', // 开发人员
        publish_app: 'sdsdassds', // 相关应用
        simple_desc: 'sdsasddsd', // 简要描述
        other_desc: 'sd', // 其他信息
        status: '' // 状态
        // float_minimum_order_amount: 20, // 起价
        // is_premium: true,
        // delivery_mode: true,
        // new: true,
        // bao: true,
        // zhun: true,
        // piao: true,
        // startTime: '',
        // endTime: '',
        // image_path: '',
        // business_license_image: '',
        // catering_service_license_image: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        project_name: [
          {required: true, message: '请输入项目名称', trigger: 'blur'}
        ],
        responsible_name: [
          {required: true, message: '请输入项目负责人', trigger: 'blur'}
        ],
        test_user: [
          {required: true, message: '请输入测试人员', trigger: 'blur'}
        ],
        dev_user: [
          {required: true, message: '请输入开发人员', trigger: 'blur'}
        ],
        publish_app: [
          {required: true, message: '请输入相关应用', trigger: 'blur'}
        ],
        simple_desc: [
          {required: true, message: '请输入概要描述', trigger: 'blur'}
        ],
        other_desc: [
          {required: true, message: '请输入备注', trigger: 'blur'}
        ],
        baseUrl,
        baseImgPath
      }
      // baseUrl,
      // baseImgPath,
      // categoryOptions: [],
      // selectedCategory: ['快餐便当', '简餐']
    }
  },
  // components: {
  //   headTop
  // },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      try {
        this.city = await cityGuess()
        const categories = await foodCategory()
        categories.forEach(item => {
          if (item.sub_categories.length) {
            const addnew = {
              value: item.name,
              label: item.name,
              children: []
            }
            item.sub_categories.forEach((subitem, index) => {
              if (index === 0) {
                return
              }
              addnew.children.push({
                value: subitem.name,
                label: subitem.name
              })
            })
            this.categoryOptions.push(addnew)
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    async querySearchAsync (queryString, cb) {
      if (queryString) {
        try {
          const cityList = await searchplace(this.city.id, queryString)
          if (cityList instanceof Array) {
            cityList.map(item => {
              item.value = item.address
              return item
            })
            cb(cityList)
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    addressSelect (address) {
      this.formData.latitude = address.latitude
      this.formData.longitude = address.longitude
      console.log(this.formData.latitude, this.formData.longitude)
    },
    handleShopAvatarScucess (res, file) {
      if (res.status === 1) {
        this.formData.image_path = res.image_path
      } else {
        this.$message.error('上传图片失败！')
      }
    },
    handleBusinessAvatarScucess (res, file) {
      if (res.status === 1) {
        this.formData.business_license_image = res.image_path
      } else {
        this.$message.error('上传图片失败！')
      }
    },
    handleServiceAvatarScucess (res, file) {
      if (res.status === 1) {
        this.formData.catering_service_license_image = res.image_path
      } else {
        this.$message.error('上传图片失败！')
      }
    },
    beforeAvatarUpload (file) {
      const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isRightType) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isRightType && isLt2M
    },
    tableRowClassName (row, index) {
      if (index === 1) {
        return 'info-row'
      } else if (index === 3) {
        return 'positive-row'
      }
      return ''
    },
    selectActivity () {
      this.$prompt('请输入活动详情', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value == null) {
          this.$message({
            type: 'info',
            message: '请输入活动详情'
          })
          return
        }
        let newObj = {}
        switch (this.activityValue) {
          case '满减优惠':
            newObj = {
              icon_name: '减',
              name: '满减优惠',
              description: value
            }
            break
          case '优惠大酬宾':
            newObj = {
              icon_name: '特',
              name: '优惠大酬宾',
              description: value
            }
            break
          case '新用户立减':
            newObj = {
              icon_name: '新',
              name: '新用户立减',
              description: value
            }
            break
          case '进店领券':
            newObj = {
              icon_name: '领',
              name: '进店领券',
              description: value
            }
            break
        }
        this.activities.push(newObj)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    handleDelete (index) {
      this.activities.splice(index, 1)
    },
    submitForm (formName) {
      // console.log("sdcsdcformName")
      // console.log(formName)
      this.$refs[formName].validate(async (valid) => {
        console.log(valid)
        if (valid) {
          // Object.assign(this.formData, {activities: this.activities}, {
          //   category: this.selectedCategory.join('/')
          // })
          console.log('进入这里')
          try {
            let result = await addProject(this.formData)
            console.log(result)
            if (result.status === 1) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.formData = {
                name: '', // 店铺名称
                address: '', // 地址
                latitude: '',
                longitude: '',
                description: '', // 介绍
                phone: '',
                promotion_info: '',
                float_delivery_fee: 5, // 运费
                float_minimum_order_amount: 20, // 起价
                is_premium: true,
                delivery_mode: true,
                new: true,
                bao: true,
                zhun: true,
                piao: true,
                startTime: '',
                endTime: '',
                image_path: '',
                business_license_image: '',
                catering_service_license_image: ''
              }
              this.selectedCategory = ['快餐便当', '简餐']
              this.activities = [{
                icon_name: '减',
                name: '满减优惠',
                description: '满30减5，满60减8'
              }]
            } else {
              this.$message({
                type: 'error',
                message: result.message
              })
            }
            console.log(result)
          } catch (err) {
            console.log(err)
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请检查输入是否正确',
            offset: 100
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '../style/mixin';
.button_submit{
  text-align: center;
}
.avatar-uploader .el-upload {
  border-top-width: 1px;
  border-top-style: dashed;
  border-top-color: #d9d9d9;
  border-right-width: 1px;
  border-right-style: dashed;
  border-right-color: #d9d9d9;
  border-left-width: 1px;
  border-left-style: dashed;
  border-left-color: #d9d9d9;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-top-color: #20a0ff;
  border-right-color: #20a0ff;
  border-left-color: #20a0ff;
  border-bottom-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
</style>
