import React from 'react';
import { MDBDataTable } from 'mdbreact';

const AccountsTable = (props) => {
  const { accounts } = props;
  const data = {
    columns: [
      {
        label: '#',
        field: 'id',
        sort: 'asc',
        width: 50,
      },
      {
        label: 'SERVER',
        field: 'server',
        sort: 'asc',
        width: 75,
      },
      {
        label: 'USERNAME',
        field: 'username',
        sort: 'asc',
        width: 150,
      },
      {
        label: 'PASSWORD',
        field: 'password',
        sort: 'asc',
        width: 150,
      },
      {
        label: 'EMAIL',
        field: 'email',
        sort: 'asc',
        width: 250,
      },
      {
        label: 'DATE OF BIRTH',
        field: 'birth',
        sort: 'asc',
        width: 125,
      },
      {
        label: 'ACCOUNT ID',
        field: 'accountId',
        sort: 'asc',
        width: 135,
      },
      {
        label: 'STATUS',
        field: 'status',
        sort: 'asc',
        width: 100,
      },
      {
        label: 'PROXY',
        field: 'proxy',
        sort: 'asc',
        width: 125,
      },
      {
        label: 'ERRORS',
        field: 'errors',
        sort: 'asc',
        width: 500,
      },
      {
        label: 'TOKEN',
        field: 'token',
        sort: 'asc',
        width: 1000,
      },
    ],
    rows: accounts,
  };
  return (
    <MDBDataTable
      // scrollX
      className="mt-1 w-auto"
      entriesOptions={[10, 25, 50, 100, 1000]}
      infoLabel={['SHOWING', 'TO', 'OF', 'ENTRIES']}
      entriesLabel="SHOW ENTRIES"
      searchLabel="SEARCH"
      paginationLabel={['PREVIOUS', 'NEXT']}
      striped
      bordered
      small
      hover
      responsive
      data={data}
    />
  );
};

export default AccountsTable;
