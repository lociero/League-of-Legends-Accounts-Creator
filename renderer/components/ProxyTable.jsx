import React from 'react';
import { Row, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import useGlobalState from '../state.js';
import { STATUS, LOCALHOST, STATE_NAMES } from '../../constants/constants.js';

const ProxyTable = () => {
  const [proxyList, updateProxyList] = useGlobalState(STATE_NAMES.PROXY_LIST);
  const cleanTable = async () => {
    const { checked } = await axios.delete(`${LOCALHOST}/clear`).then((res) => res.data);
    updateProxyList(checked);
  };

  const columns = [
    {
      text: '#',
      dataField: 'id',
      sort: true,
    },
    {
      text: 'COUNTRY',
      dataField: 'country',
      sort: true,
    },
    {
      text: 'IP',
      dataField: 'ip',
    },
    {
      text: 'PORT',
      dataField: 'port',
    },
    {
      text: 'TYPE',
      dataField: 'type',
      sort: true,
    },
    {
      text: 'USERNAME',
      dataField: 'username',
    },
    {
      text: 'PASSWORD',
      dataField: 'password',
    },
    {
      text: 'IS WORKING',
      dataField: 'isWorking',
      sort: true,
    },
  ];

  const rowClasses = (row) => {
    if (row.isWorking === STATUS.PROXY.NOT_WORKING) {
      return 'alert-danger';
    }
    if (row.isWorking === STATUS.PROXY.WORKING) {
      return 'alert-success';
    }
    return '';
  };

  return (
    <>
      <Row className="flex-row m-1 align-items-center">
        <p className="text-success mb-0 ml-2">LOADED: {proxyList.length}</p>
        <p className="text-success mb-0 ml-2">
          WORKING: {proxyList.filter(({ isWorking }) => isWorking === STATUS.PROXY.WORKING).length}
        </p>
        <p className="text-success mb-0 ml-2">
          CHECKED: {proxyList.filter(({ isWorking }) => isWorking).length}/{proxyList.length}
        </p>
        <Button className="ml-auto mr-1" variant="outline-danger" size="sm" onClick={cleanTable}>
          Clean table
        </Button>
      </Row>

      <BootstrapTable
        wrapperClasses="table-responsive"
        bootstrap4
        keyField="id"
        rowClasses={rowClasses}
        data={proxyList}
        columns={columns}
        pagination={paginationFactory({ sizePerPageList: [10, 50, 100, 1000] })}
        noDataIndication="TABLE IS EMPTY"
        condensed
      />
    </>
  );
};

export default ProxyTable;
