import { useCallback, useEffect, useState, type JSX } from 'react';
import EnumInput from './EnumInput.tsx';
import Row from './Row.tsx';

interface TableProps<T> {
  label: string;
  list: T[];
  setList: (list: T[]) => void;
  endpoint: string;
  deserialize?: (elem: T) => T;
  optionalParams?: string;
  getStrings: (elem?: T) => string[];
  onClick: (i: number) => void;
}

export default function Table<T>(props: TableProps<T>) {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [maxPageNumber, setMaxPageNumber] = useState(0);
  const { setList, endpoint, deserialize, optionalParams } = props;
  const fetchList = useCallback(async () => {
    const params = optionalParams || '';
    const amountResponse = await fetch(`${endpoint}/amount?${params}`);
    const amount = await amountResponse.json();
    if (typeof amount !== 'number') {
      return;
    }
    const newMaxPageNumber = Math.floor(amount/pageSize);
    setMaxPageNumber(newMaxPageNumber);
    const currentPageNumber = Math.min(pageNumber, newMaxPageNumber);
    setPageNumber(currentPageNumber);
    const request = `${endpoint}?pageNumber=${currentPageNumber}`+
      `&pageSize=${pageSize}${params}`;
    const body = await fetch(request).then((x) => x.json());
    const list = deserialize ? body.map(deserialize) : body;
    setList(list);
  }, [pageNumber, pageSize, setList, endpoint, deserialize, optionalParams]);
  useEffect(() => {
    fetchList();
  }, [fetchList]);
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
    <div className='flex-row'>
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
    </div>
  </>);
}
