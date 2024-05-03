import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Divider, Steps, Upload } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const { Dragger } = Upload;

const HomePage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [xlsxFile, setXlsxFile] = useState<null | any>(null);
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Steps
          current={current}
          items={[
            {
              title: '达人数据excel上传',
              description: (
                <div>
                  按照格式上传达人数据的excel文件
                  <br />
                  必须带有达人主页网站地址
                </div>
              ),
            },
            {
              title: '收集达人email',
              description: (
                <div>
                  收集达人的email
                  <br />
                  需要一定的手动操作
                </div>
              ),
            },
          ]}
        />
        <Divider />
        {current === 0 && (
          <Dragger
            accept=".xls,.xlsx"
            name="file"
            multiple={false}
            showUploadList={false}
            beforeUpload={(file, fileList) => {
              console.log(file, fileList);
              setXlsxFile(file);
              return Promise.resolve(true);
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            {!xlsxFile ? (
              <>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </>
            ) : (
              <>
                <p className="ant-upload-text">文件已上传</p>
                <p className="ant-upload-hint">{xlsxFile.name}</p>
              </>
            )}
          </Dragger>
        )}
      </div>
    </PageContainer>
  );
};

export default HomePage;
