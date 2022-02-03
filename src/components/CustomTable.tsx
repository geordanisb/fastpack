import React from 'react'
import {Table, ButtonGroup, Button} from 'react-bootstrap'
import {AiOutlinePlus,AiFillEye,AiFillEdit,AiFillMinusCircle} from 'react-icons/ai'
import {v4} from 'uuid'
import {useRouter} from 'next/router'

interface Props {
    columns:string[],
    data?:Record<string,any>[];
    actions?:{
      details: (id:number) => Promise<void>;
      edit: (id:number) => Promise<void>;
      remove: (id:number) => Promise<void>;
    }
}
const CustomTable: React.FC<Props> = ({columns, data, actions})=>{
    const router = useRouter();
  const renderBody = ()=>{
    if(data)
        return data.map((d)=>{
            return <tr key={v4()}>{
              columns.map((c)=><td key={v4()}>{d[c]}</td>)
            }
            {actions && <td><ButtonGroup size="sm">
                <Button onClick={()=>actions.details(d.id)}><AiFillEye/></Button>
                <Button onClick={()=>actions.edit(d.id)} variant="warning"><AiFillEdit/></Button>
                <Button onClick={()=>actions.remove(d.id)} variant="danger"><AiFillMinusCircle/></Button>
              </ButtonGroup>
            </td>}
                        
          </tr>;
        });
    }
    return <section>
      <Button onClick={()=>router.push('/item/create')} variant="success"><AiOutlinePlus/></Button>
      {data && <Table striped bordered hover>
    <thead>
      <tr>
          {columns.map((c)=><th key={v4()} data-cy={c}>{c}</th>)}
          {actions && <th>Actions</th>}        
      </tr>
    </thead>
    <tbody>
      {renderBody()}
    </tbody>
  </Table>}
      </section>;
}

export default CustomTable;