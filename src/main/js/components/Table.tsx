import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import EnumInput from './EnumInput.tsx';
import Row from './Row.tsx';

interface TableProps<T> {
  label: string;
  list: T[];
  setList: (list: T[]) => void;
  endpoint: string;
  deserialize?: (elem: T) => T;
  optionalParams?: string;
  disablePagination?: boolean;
  requestBody?: object;
  getStrings: (elem?: T) => string[];
  onClick: (i: number) => void;
}

export default function Table<T>(props: TableProps<T>) {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [maxPageNumber, setMaxPageNumber] = useState(0);
  const {
    setList,
    endpoint,
    deserialize,
    optionalParams,
    disablePagination,
    requestBody
  } = props;
  const params = useMemo(() => optionalParams || '', [optionalParams]);
  const fetchBody = useCallback(async (request: string) => {
    if (requestBody) {
      return fetch(request, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }).then((x) => x.json());
    }
    return fetch(request).then((x) => x.json());
  }, [requestBody]);
  const fetchPageList = useCallback(async () => {
    const amountResponse = await fetch(`${endpoint}/amount?${params}`);
    const amount = await amountResponse.json();
    if (typeof amount !== 'number') {
      return;
    }
    const newMaxPageNumber = Math.max(0, Math.ceil(amount/pageSize)-1);
    setMaxPageNumber(newMaxPageNumber);
    const currentPageNumber = Math.min(pageNumber, newMaxPageNumber);
    setPageNumber(currentPageNumber);
    const request = `${endpoint}?pageNumber=${currentPageNumber}`+
      `&pageSize=${pageSize}${params}`;
    return fetchBody(request);
  }, [fetchBody, pageNumber, pageSize, endpoint, params]);
  const fetchList = useCallback(async () => {
    return fetchBody(`${endpoint}?${params}`);
  }, [fetchBody, endpoint, params]);
  const updateList = useCallback(async () => {
    const body = await (disablePagination ? fetchList() : fetchPageList());
    const list = deserialize ? body.map(deserialize) : body;
    setList(list);
  }, [fetchPageList, fetchList, deserialize, setList, disablePagination]);
  useEffect(() => {
    updateList();
  }, [updateList]);
  const headers = props.getStrings();
  const headerElements: JSX.Element[] = [];
  for (const header of headers) {
    headerElements.push(<th scope='col'>{header}</th>);
  }
  const rows: JSX.Element[] = [];
  for (let i = 0; i < props.list.length; i++) {
    const strings = props.getStrings(props.list[i]);
    rows.push(<Row strings={strings} onClick={() => props.onClick(i)}/>);
  }
  return (<>
    <p className='text' style={{fontSize: '16px'}}>{props.label}</p>
    <div className='table-div'>
      <table>
        <thead>
          <tr>{headerElements}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
    {!props.disablePagination && <div className='flex-row'>
      <EnumInput
        label='Page size'
        possibleValues={['5', '10', '20']}
        value={pageSize.toString()}
        onChange={(value) => setPageSize(Number(value))}
      />
      <button
          onClick={() => setPageNumber(pageNumber-1)}
          style={{width: '64px'}}
          disabled={pageNumber === 0}>
        Prev
      </button>
      <p className='text'>{pageNumber+1}/{maxPageNumber+1}</p>
      <button
          onClick={() => setPageNumber(pageNumber+1)}
          style={{width: '64px'}}
          disabled={pageNumber === maxPageNumber}>
        Next
      </button>
    </div>}
  </>);
}
