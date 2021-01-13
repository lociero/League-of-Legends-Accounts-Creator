import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { STATUS } from '../../constants/constants.js';

const AccountsTable = (props) => {
  const { accounts } = props;
  const columns = [
    {
      text: '#',
      dataField: 'id',
      sort: true,
    },
    {
      text: 'SERVER',
      dataField: 'server',
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
      text: 'EMAIL',
      dataField: 'email',
    },
    {
      text: 'DATE OF BIRTH',
      dataField: 'birth',
    },
    {
      text: 'ACCOUNT ID',
      dataField: 'accountId',
    },
    {
      text: 'STATUS',
      dataField: 'status',
      sort: true,
    },
    {
      text: 'PROXY',
      dataField: 'proxy',
    },
    {
      text: 'ERRORS',
      dataField: 'errors',
    },
    {
      text: 'TOKEN',
      dataField: 'token',
    },
  ];

  const rowClasses = (row) => {
    if (row.status === STATUS.ACCOUNT.FAILED) {
      return 'alert-danger';
    }
    if (row.status === STATUS.ACCOUNT.SUCCESS) {
      return 'alert-success';
    }
    return '';
  };

  return (
    <BootstrapTable
      wrapperClasses="table-responsive"
      bootstrap4
      keyField="id"
      rowClasses={rowClasses}
      data={accounts}
      columns={columns}
      pagination={paginationFactory({ sizePerPageList: [10, 50, 100, 1000] })}
      noDataIndication="TABLE IS EMPTY"
      condensed
    />
  );
};

export default AccountsTable;
