import { useEmailEvent } from '@/hooks';
import { delay } from '@/utils/format';
import { InboxOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import type { PaginationProps, TableProps } from 'antd';
import {
  Button,
  Col,
  Divider,
  Image,
  Row,
  Steps,
  Table,
  Upload,
  message,
} from 'antd';
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import styles from './index.less';

const { Dragger } = Upload;
interface ITableRow {
  达人头像: string;
  达人昵称: string;
  达人ID: string;
  达人分类: string;
  '国家/地区': string;
  粉丝数: string;
  销量: string;
  销售额: string;
  视频GPM: string;
  直播GPM: string;
  FastMoss达人详情页: string;
  TikTok官网达人主页: string;
  邮箱: string;
  日期: string;
}

const ColumnsWidth = [
  {
    width: 100,
    fixed: 'left',
  },
  {
    width: 150,
    ellipsis: true,
  },
  {
    width: 150,
    ellipsis: true,
  },
  {
    width: 100,
    ellipsis: true,
  },
  {
    width: 100,
    ellipsis: true,
  },
  {
    width: 150,
    ellipsis: true,
  },
  {
    width: 150,
    ellipsis: true,
  },
  {
    width: 150,
    ellipsis: true,
  },
  {
    width: 250,
    ellipsis: true,
  },
  {
    width: 250,
    ellipsis: true,
  },
  {
    width: 250,
    ellipsis: true,
    // fixed: 'right',
  },
  {
    width: 250,
    ellipsis: true,
    // fixed: 'right',
  },
  {
    width: 150,
    ellipsis: true,
    fixed: 'right',
  },
  {
    width: 150,
    ellipsis: true,
    fixed: 'right',
  },
];

const showTotal: PaginationProps['showTotal'] = (total) =>
  `总计 ${total} 条数据`;

const HomePage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [xlsxFile, setXlsxFile] = useState<null | any>(null);
  const [workbook, setWorkbook] = useState<null | XLSX.WorkBook>(null);
  const [dataSource, setDataSource] = useState<ITableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const tableProps = useMemo<{
    columns: TableProps<ITableRow>['columns'];
    // dataSource: TableProps<ITableRow>['dataSource'];
  }>(() => {
    const defaultData = {
      columns: [],
      sheetDataSource: [],
    };
    if (!workbook) {
      return defaultData;
    }
    const { SheetNames, Sheets } = workbook;
    const sheetName = SheetNames[0];
    const sheet = Sheets[sheetName];
    if (!sheet) {
      return defaultData;
    }
    const sheetData = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
    });
    const sheetHeader = sheetData[0];
    const columns = sheetHeader.map((item, index) => ({
      ...(ColumnsWidth[index] ?? {}),
      title: item,
      width: item === '邮箱' ? 250 : undefined,
      dataIndex: item,
      key: item,
      ellipsis: {
        showTitle: true,
      },
      render:
        item === '达人头像'
          ? (text: string) => {
              return (
                <Image
                  width={50}
                  height={50}
                  src={text}
                  fallback="data:image/png;base64,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"
                />
              );
            }
          : undefined,
    }));
    const dataSource = sheetData.slice(1).map((items) => {
      return items.reduce((pre: any, cur, i) => {
        pre[sheetHeader[i]] = cur;
        return pre;
      }, {});
    });
    setDataSource(dataSource);
    return { columns, dataSource } as {
      columns: TableProps<ITableRow>['columns'];
      // sheetDataSource: TableProps<ITableRow>['dataSource'];
    };
  }, [workbook]);
  useEmailEvent((detail) => {
    console.log('Message from Content Script:', detail);
    const { nickname, email } = detail;
    setDataSource(
      dataSource.map((item) => {
        if (item['达人昵称'] === nickname) {
          item['邮箱'] = email;
        }
        return { ...item };
      }),
    );
  });
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
            beforeUpload={(file) => {
              setXlsxFile(file);
              return file.arrayBuffer().then((arrayBuffer) => {
                const workbook = XLSX.read(arrayBuffer);
                setWorkbook(workbook);
                setCurrent(1);
                return Promise.resolve(true);
              });
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
        {current === 1 && (
          <>
            <Row justify="end" style={{ marginBottom: 8 }}>
              <Col>
                <Button
                  style={{ marginRight: 8 }}
                  onClick={async () => {
                    const startIndex = (currentPage - 1) * pageSize;
                    const curPageData = (dataSource ?? []).slice(
                      startIndex,
                      startIndex + pageSize,
                    );
                    if (!curPageData.length) {
                      message.error('当前页没有数据');
                      return;
                    }
                    let index = 0;
                    while (index < curPageData.length) {
                      window.open(curPageData[index]['TikTok官网达人主页']);
                      await delay(1000);
                      index++;
                    }
                  }}
                >
                  获取当前页邮箱数据
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setCurrent(0);
                    setXlsxFile(null);
                  }}
                >
                  上一步
                </Button>
              </Col>
            </Row>
            <Table
              columns={tableProps.columns}
              scroll={{ x: 1200 }}
              dataSource={dataSource}
              pagination={{
                position: ['topRight'],
                showTotal: showTotal,
                current: currentPage,
                pageSize,
                total: (dataSource ?? []).length,
                onChange: (page, pageSize) => {
                  console.log('page', page, pageSize);
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
              }}
              rowKey="达人ID"
            />
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default HomePage;
