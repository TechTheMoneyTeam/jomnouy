import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Form, 
  Input, 
  Select, 
  Upload, 
  InputNumber,
  Button,
  Card,
  Typography,
  message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

// Configure axios
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

const ProjectSubmit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectTypesResponse, categoriesResponse] = await Promise.all([
          axios.get('/project-types'),
          axios.get('/categories')
        ]);
        
        setProjectTypes(projectTypesResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Failed to fetch project types or categories');
      }
    };

    fetchData();
  }, []);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    if (!isLt10M) {
      message.error('File must be smaller than 10MB!');
      return false;
    }

    return true;
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/project/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(response.data, file);
    } catch (error) {
      console.error('Upload failed:', error);
      onError(error);
      message.error('Upload failed');
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      if (!fileList[0]?.response?.url) {
        message.error('Please upload a project image');
        return;
      }

      const formData = {
        ...values,
        project_img: fileList[0].response.url,
        status: 'pending',
        funding_goal: parseFloat(values.funding_goal),
        reverse_price: parseFloat(values.reverse_price)
      };
      
      await axios.post('/project', formData);
      
      message.success('Project created successfully');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Failed to create project:', error);
      message.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <Title level={2}>Create New Project</Title>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish} 
          disabled={loading}
        >
          <Form.Item 
            label="Project Title" 
            name="title" 
            rules={[{ required: true, message: 'Please input project title!' }]}
          >
            <Input placeholder="Enter project title" />
          </Form.Item>

          <Form.Item 
            label="Project Description" 
            name="project_des" 
            rules={[{ required: true, message: 'Please input project description!' }]}
          >
            <TextArea rows={4} placeholder="Enter project description" />
          </Form.Item>

          <Form.Item 
            label="Project Type" 
            name="project_type_id" 
            rules={[{ required: true, message: 'Please select project type!' }]}
          >
            <Select placeholder="Select project type">
              {projectTypes.map(type => (
                <Select.Option key={type.id} value={type.id}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            label="Category" 
            name="category_id" 
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select category">
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            label="Funding Goal" 
            name="funding_goal" 
            rules={[{ required: true, message: 'Please enter funding goal!' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0} 
              placeholder="Enter funding goal" 
            />
          </Form.Item>

          <Form.Item 
            label="Reserve Price" 
            name="reverse_price" 
            rules={[{ required: true, message: 'Please enter reserve price!' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0} 
              placeholder="Enter reserve price" 
            />
          </Form.Item>

          <Form.Item 
            label="Project Image" 
            name="project_img" 
            rules={[{ required: true, message: 'Please upload a project image!' }]}
          >
            <Upload 
              customRequest={handleUpload}
              beforeUpload={beforeUpload}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
            >
              Create Project
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProjectSubmit;