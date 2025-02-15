import React, { useState } from 'react';
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

const ProjectSubmit= () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const onFinish = async (values) => {
    try {
      const formData = {
        ...values,
        project_image: imageUrl,
        project_video: videoUrl,
        status: 'pending', // default status
        user_id: 1, // replace with actual user ID from auth
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        message.success('Project created successfully');
        form.resetFields();
      } else {
        message.error('Failed to create project');
      }
    } catch (error) {
      message.error('Error creating project');
      console.error('Error:', error);
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload', // Replace with your upload endpoint
    headers: {
      authorization: 'Bearer your-token', // Replace with actual auth token
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        // Update the respective URL state based on file type
        if (info.file.type?.startsWith('image')) {
          setImageUrl(info.file.response.url);
        } else if (info.file.type?.startsWith('video')) {
          setVideoUrl(info.file.response.url);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="project-form-container">
      <Card className="form-card">
        <Title level={2}>Create New Project</Title>
        <p className="subtitle">Fill in the details to create your project</p>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="project-form"
        >
          <Form.Item
            label="Project Title"
            name="title"
            rules={[{ required: true, message: 'Please input project title!', max: 100 }]}
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
            name="project_type"
            rules={[{ required: true, message: 'Please select project type!' }]}
          >
            <Select placeholder="Select project type">
              <Select.Option value={1}>Type 1</Select.Option>
              <Select.Option value={2}>Type 2</Select.Option>
              <Select.Option value={3}>Type 3</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Funding Goal"
            name="funding_goal"
            rules={[{ required: true, message: 'Please enter funding goal!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter reserve price"
            />
          </Form.Item>

          <Form.Item
            label="Project Image"
            name="project_image"
          >
            <Upload {...uploadProps} accept="image/*">
              <Button icon={<UploadOutlined />}>Upload Project Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Project Video"
            name="project_video"
          >
            <Upload {...uploadProps} accept="video/*">
              <Button icon={<UploadOutlined />}>Upload Project Video</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="next-button">
              Create Project
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProjectSubmit;