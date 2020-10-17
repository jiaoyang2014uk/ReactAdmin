import React, {Component} from 'react'
import { Card, Select, Button, Icon, Table, Input, message } from 'antd';
import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option  = Select.Option

/**
 * product的默认子路由组件
 */
export default class ProductHome extends Component{
    state={
        total: 0,//商品的总数量
        products: [],
        loading: false,//是否正在获取数据中
        searchName: '',//搜索关键字
        searchType: 'productName',//根据哪个字段搜索
    }
//初始化table的列数组
    initColums=()=>{
        this.columns=[
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render:(price)=> '￥' + price//当前指定了对应的属性，传入了对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product)=>{
                    const {status, _id} = product
                    const newStatus = status===1 ? 2: 1
                    return(
                        <span>
                            <Button type='primary' onClick={()=>this.updateStatus(_id, newStatus)}>{status === 1? '下架' : '上架'}</Button>
                            <span>{status === 1? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product)=>{
                    return(
                        <span>
                            {/** 将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick={()=>this.props.history.push('/product/detail', {product})}>详情</LinkButton>
                            <LinkButton onClick={()=>this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },

        ]
    }
    //获取指定页面的列表数据显示
    getProducts=async (pageNum)=>{
        this.pageNum = pageNum //保存pagenum，让其他方法可以看到
        //在发请求前显示loading
        this.setState({loading:true})
        const {searchName, searchType} = this.state
        //如果搜索关键字有值，说明进行搜索分页，
        let result
        if(searchName){
            result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchName, searchType})
        }else{//一般分页
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        
         //在请求完成后，隐藏loading
         this.setState({loading:false})
        if(result.status=== 0){
            const mock = {
                total: 3,
                list:[
                {name:'联想', _id: 1, desc: '联想笔记本', price: 10000, status: 2, imgs:['image-1554638676149.jpg', 'image-1554638683746.jpg'], detail: '<h1 style="color: red">性能好</h1>', pCategoryId: 1, categoryId: 2},
                {name:'华硕', _id: 2, desc: '华硕笔记本', price: 20000, status: 1, imgs:['image-1554638676149.jpg', 'image-1554638683746.jpg'], detail: '<h1 style="color: green">速度快</h1>', pCategoryId: 1, categoryId: 2},
                {name:'小米', _id: 3, desc: '小米笔记本', price: 30000, status: 2, imgs:['image-1554638676149.jpg', 'image-1554638683746.jpg'], detail: '<h1 style="color: blue">便宜</h1>', pCategoryId: 1, categoryId: 2},
            ]
        }
        //取出分页数据，更新状态，显示分页列表
            // const {list, total}  = result.data
            const {list, total}  = mock
           
            this.setState({
                total,
                products: list
            })
        }
    }
    //更新指定商品的状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if(result.status === 0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    componentWillMount(){
        this.initColums()
    }
    componentDidMount(){
        this.getProducts(1)
    }
    render(){
        //取出状态数据
        const {products, total, loading, searchName, searchType} = this.state
        //card的左侧
        const title= (
            <span>
                <Select value={searchType} style={{width: 150}} onChange={value=>this.setState({searchType: value})}>
                    <Option value='productName' >按名称搜索</Option>
                    <Option value='productDesc' >按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width: 150, margin: '0 15px'}} value={searchName} 
                onChange={e=>this.setState({searchName: e.target.value})}/>
                <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )
        //card的右侧
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <Icon type='plus' />添加商品
            </Button>
        )
        return(
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={products} 
                    columns={this.columns} 
                    loading={loading}
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper:true,
                        total,
                        onChange: this.getProducts
                    }}
                />;
            </Card>
        )
    }
}