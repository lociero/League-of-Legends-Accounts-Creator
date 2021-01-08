import React from 'react';
import { Row, Button } from 'react-bootstrap';
import { MDBDataTable } from 'mdbreact';
import useGlobalState from '../state.js';
import { STATE_NAMES } from '../constants.js';

const ProxyTable = () => {
  const [proxyList, updateProxyList] = useGlobalState(STATE_NAMES.PROXY_LIST);
  const cleanTable = () => {
    updateProxyList([]);
  };

  const data = {
    columns: [
      {
        label: '#',
        field: 'id',
        sort: 'asc',
      },
      {
        label: 'COUNTRY',
        field: 'country',
        sort: 'asc',
      },
      {
        label: 'IP',
        field: 'ip',
        sort: 'asc',
      },
      {
        label: 'PORT',
        field: 'port',
        sort: 'asc',
      },
      {
        label: 'TYPE',
        field: 'type',
        sort: 'asc',
      },
      {
        label: 'IS WORKING',
        field: 'isWorking',
        sort: 'asc',
      },
    ],
    rows: proxyList,
  };

  return (
    <>
      <Row className="flex-row m-1 align-items-center">
        <p className="text-success mb-0 ml-2">LOADED: {proxyList.length}</p>
        <p className="text-success mb-0 ml-2">
          WORKING: {proxyList.filter(({ isWorking }) => isWorking === 'TRUE').length}
        </p>
        <p className="text-success mb-0 ml-2">
          CHECKED: {proxyList.filter(({ isWorking }) => isWorking).length}/{proxyList.length}
        </p>
        <Button className="ml-auto mr-1" variant="outline-danger" size="sm" onClick={cleanTable}>
          Clean table
        </Button>
      </Row>

      <MDBDataTable
        // scrollX
        // scrollY
        // maxHeight="300px"
        searching={false}
        entriesOptions={[10, 25, 50, 100, 1000]}
        striped
        bordered
        small
        hover
        responsive
        data={data}
      />
    </>
  );
};

export default ProxyTable;
