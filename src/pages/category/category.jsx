import React, {Component} from 'react'
import { Card, Button, Table, message } from 'antd';
import {
    PlusOutlined,
    ArrowRightOutlined
  } from '@ant-design/icons';
  import LinkButton from '../../components/link-button'
  import {reqCategory} from '../../api'

/**
 * 商品分类路由
 */
export default class Category extends Component{
    state={
        loading: false,//是否正在获取数据中
        categorys: [],//一级分类列表
        subCategorys: [],//二级分类列表
        parentId: '0',//当前需要显示的分类列表的父分类ID
        parentName: '',//当前需要显示的分类列表的父分类名称
    }

    /**
     * 初始化table所有列的数组
     */
    initColums = () =>{
        this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name',//显示数据对应的属性名
            },
            {
              title: '操作',
              width: 300,
              render:(category)=>(//返回需要显示的界面标签
                    <span>
                      <LinkButton onClick={this.showCategorys}>修改分类</LinkButton>
                      {
                          this.state.parentId === '0' ?
                          <LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton>
                          : null
                      }
                  </span>
              )
            }
          ];
    }

    //异步获取一级分类列表显示
    getCategorys = async ()=>{
        //在发请求前显示loading
        this.setState({loading:true})
        const {parentId} = this.state
        //发异步ajax请求，获取数据
        const result = await reqCategory(parentId)
        //在请求完成后，隐藏loading
        this.setState({loading:false})
        if(result.status=== 0){
            //取出分类数组（一级或者二级）
            const categorys = result.data
            if(parentId === '0'){
                const mock = [
                    {name:'家用电器', _id: 1},
                    {name:'电脑', _id: 2},
                    {name:'图书', _id: 3},
                    {name:'服装', _id: 4},
                    {name:'食品', _id: 5},
                    {name:'玩具', _id: 6},
                    {name:'医药', _id: 7},
                    {name:'汽车产品', _id: 8},
                    {name:'箱包', _id: 9},
                ]
                //更新一级分类数组状态
                // this.setState({categorys})
                this.setState({categorys: mock})
            } else{
                const subMock = [
                    {name:'电视', _id: 1},
                    {name:'冰箱洗衣机', _id: 2},
                    {name:'空调', _id: 3},
                    {name:'厨卫电器', _id: 4},
                    {name:'aaa', _id: 5},
                    {name:'bbb', _id: 6},
                ]
                //更新一级分类数组状态
                // this.setState({subCategorys: categorys})
                this.setState({subCategorys: subMock})
            }
            
        } else{
            message.error('获取分类列表失败')
        }
    }
//显示指定一级分类对象的二级分类
    showSubCategorys = (category) =>{
        //更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, ()=>{//回调函数在状态更新且重新render后执行
            //获取二级分类列表
            this.getCategorys()
        })
    }
//显示指定一级分类
    showCategorys = ()=>{
        //更新为显示一级列表的状态
        this.setState({
            parentId: '0', 
            parentName: '', 
            subCategorys: []
        })
    }

//为第一次render准备数据
    componentWillMount(){
        this.initColums()
    }

    //执行异步任务：发异步ajax请求
    componentDidMount(){
        //获取一级分类列表
        this.getCategorys()
    }

    render(){
        //读取状态数据
        const {categorys, subCategorys, parentId, parentName, loading} = this.state
        //card的左侧
        const title=parentId === '0' ? '一级分类列表': (
            <span>
                <LinkButton>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight: '5px'}}/>
                <span>{parentName}</span>
            </span>
        )
        //card的右侧
        const extra = (
            <Button type='primary'><PlusOutlined />添加</Button>
        )
          
        return(
            <Card title={title} extra={extra}>
                <Table 
                    dataSource={parentId==='0'?categorys:subCategorys} 
                    columns={this.columns} 
                    bordered
                    rowKey='_id'
                    loading={loading}
                    pagination={{
                            defaultPageSize: 5,
                            showQuickJumper:true
                    }}
                />;
          </Card>
        )
    }
}