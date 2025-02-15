import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Upload, 
  InputNumber,
  Button,
  Card,
  Typography,
  message,
  Spin
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const ProjectSubmit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [fileList, setFileList] = useState({
    image: [],
    video: []
  });

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  const fetchProjectTypes = async () => {
    try {
      const response = await fetch('/api/project-types');
      if (response.ok) {
        const data = await response.json();
        setProjectTypes(data);
      } else {
        throw new Error('Failed to fetch project types');
      }
    } catch (error) {
      message.error('Failed to load project types');
      console.error(error);
    }
  };

  const beforeUpload = (file, type) => {
    const isImage = type === 'image' && file.type.startsWith('image/');
    const isVideo = type === 'video' && file.type.startsWith('video/');
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isImage && !isVideo) {
      message.error(`Please upload ${type} file only!`);
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

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onSuccess(data, file);
    } catch (error) {
      onError(error);
    }
  };

  // Define the onFinish function here
  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log('Form submitted:', values);

      const selectedProjectType = projectTypes.find(type => type.name === values.project_type);
      console.log('Selected project type:', selectedProjectType);

      const formData = {
        ...values,
        project_type_id: selectedProjectType ? selectedProjectType.id : null,
        project_img: fileList.image[0]?.response?.url,
        project_video: fileList.video[0]?.response?.url,
        status: 'pending',
        funding_goal: parseFloat(values.funding_goal),
        reverse_price: parseFloat(values.reverse_price)
      };

      console.log('Form data sent to server:', formData);

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        message.success('Project created successfully');
        form.resetFields();
        setFileList({ image: [], video: [] });
      } else {
        throw new Error(data.message || 'Failed to create project');
      }
    } catch (error) {
      message.error(error.message);
      console.error(error);
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
          onFinish={onFinish} // Call onFinish when the form is submitted
          disabled={loading}
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
            label="Project Type (Optional)"
            name="project_type"
          >
            <Select placeholder="Select project type (Optional)">
              {projectTypes.map(type => (
                <Select.Option key={type.id} value={type.name}>
                  {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
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
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
              placeholder="Enter reserve price"
            />
          </Form.Item>

          <Form.Item label="Project Image">
            <Upload
              customRequest={handleUpload}
              beforeUpload={file => beforeUpload(file, 'image')}
              fileList={fileList.image}
              onChange={({ fileList }) => setFileList(prev => ({ ...prev, image: fileList }))}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Project Video">
            <Upload
              customRequest={handleUpload}
              beforeUpload={file => beforeUpload(file, 'video')}
              fileList={fileList.video}
              onChange={({ fileList }) => setFileList(prev => ({ ...prev, video: fileList }))}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Video</Button>
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