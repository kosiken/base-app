import { NextPage } from 'next';
import * as React from 'react';
import Select from '../../components/Select';
import {Formik} from 'formik';
import * as Yup from 'yup';
import { WithSideBar } from '../../components/SidebarLayout'
import { SERVER_URL } from '../../constants';
import Api from '../../service/pollsApi';
import { ILga } from './lga';
import { useMutation, useQuery } from 'react-query';
import Button from '../../components/Button';
import { IPollingUnit } from './polling_unit';
import Link from 'next/link';


export interface IWard { 
    uniqueid: number;
    ward_id: number;
    ward_name: string;
    lga_id: number;
    ward_description: string;
    entered_by_user: string;
    date_entered: Date;
    user_ip_address: string;
}

const CreatePollingUnit: NextPage<{
    data: {
        payload: ILga[]; page: number;
        total: number;
        size: number;
        rows: number;

    }
}> = ({data}) => {
    const [lgas, setLgas] = React.useState<ILga[]>([]);
    const [wards, setWards] = React.useState<IWard[]>([])
    const [selectedLga, setSelectedLga] = React.useState<number>(-1);
    const [selectedWard, setSelectedWard] = React.useState(-1)
    const [created, setCreated] = React.useState<number>(-1)
    React.useEffect(() => {
        setLgas(data.payload);
    }, [data]);
    const create = React.useCallback(async (data: any) => {
        setCreated(-1);

        const payload = ({
            pollingUnit: {
                ...data.polling_unit,
                ward_id: selectedWard,
                lga_id: selectedLga
            },
            results: data.results
        })

        const resp = await Api.createPu<IPollingUnit>({
            payload,
            modelName: 'polling_unit'
        })

        return resp
    }, [selectedLga, selectedWard])
    React.useEffect(() => {

        if(selectedLga > -1) {
            // setWards([])
         
            setSelectedWard(-1);
  

            refetch()
        
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLga]);
    const memo = React.useCallback(
        async () => {
            if(selectedLga <= -1 ) {
                return
            }
        
            let ans = await Api.getModelList<IWard>({
                modelName: 'ward',
                crieteria: {
                    lga_id: selectedLga,
                },
                page: 1,
                limit: 10000,
            })
            return ans.data
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedLga],
    )


    
    const { data: ret, isFetching, refetch, isError } = useQuery('load-wards', memo, {
        enabled: true,
        refetchOnMount: false,
    });
    const {data: resp, isLoading, mutate} = useMutation(create, 
        {
            onError: function () {
                window.alert('Failed to create')
            },
            onSuccess(data, variables, context) {
                if(data.code === 200 || data.code === 201) {
                   setCreated(data.data!.data.uniqueid);
                   window.alert('created successfully')
                }
            },
        } )
    React.useEffect(() => {
        if (!ret) return;
        let ans = ret!.data;
        if (ans) {
            setWards(ans.payload);
          
            //    setPageSize(ans.size)
        }
    }, [ret]);
  return (
    <div className="flex flex-col max-h-[700px] h-[80vh]">
        {created > -1 && (     <p className="py-2 pl-2 bg-secondary text-primary pr-2 font-medium text-sm leading-6 whitespace-nowrap border-b border-t border-secondary dark:border-otherColor">
                        Created Polling unit <Link href={`/modules/polling_unit_result/${created}`}><span className='text-cyan-500'>View here</span></Link>
        
                    </p>)}
         <div className="flex-1 overflow-y-scroll">
<div className="mb-2">
<Select

value={selectedLga}
onChange={e => {
    console.log(e.target.value);
    setSelectedLga(parseInt((e.target as any).value))
}}
>
<option value="-1">-- Select LGA --</option>
{lgas.map((lga, i) => (
    <option key={`lga-${i}`} value={lga.lga_id}>
        {lga.lga_name}
    </option>
))}
</Select>
</div>
<div className="mb-2">
<Select
disabled={isFetching}
value={selectedWard}
onChange={e => {
    setSelectedWard(parseInt((e.target as any).value))
}}
>
<option value="-1">-- {selectedLga > -1 ? 'Select Ward' : 'Select LGA first'} --</option>
{wards.map((ward, i) => (
    <option key={`ward-${i}`} value={ward.ward_id}>
        {ward.ward_name}
    </option>
))}
</Select>
</div>

<Formik initialValues={{
            polling_unit_name: '',
            polling_unit_number: '',
            polling_unit_description: '',
            lat: '',
            long: '',
            PDP: '',
            DPP: '',
            ACN: '',
            PPA: '',
            CDC:'',
            JP: ''
}} validationSchema={Yup.object({
    polling_unit_description: Yup.string().required('Value is required'),
    polling_unit_name: Yup.string().required('Value is required'),
    polling_unit_number: Yup.string().required('Value is required'),
    lat: Yup.string().required('Value is required'),
    long: Yup.string().required('Value is required'),

    PDP: Yup.number().required('Value is required'),
    DPP: Yup.number().required('Value is required'),
    ACN: Yup.number().required('Value is required'),
    PPA: Yup.number().required('Value is required'),
    CDC:Yup.number().required('Value is required'),
    JP: Yup.number().required('Value is required')
})}
onSubmit={(p) => {

    mutate({
        polling_unit: {
            polling_unit_name: p.polling_unit_name,
            polling_unit_number: p.polling_unit_number,
            polling_unit_description: p.polling_unit_description,
            lat: p.lat,
            long: p.long,
        },
        results: ['PDP', 'DPP', 'ACN', 'PPA', 'CDC', 'JP'].reduce((a, b) => ({...a, [b]: (p as any)[b]}), {})
    })
}}
>
{formData=> 
{const props = formData as any;
     return (<div>
<div className="mb-2 mt-2 ">
    <label htmlFor={'#polling_unit_name'} className="block">Polling Unit Name</label> 
<input
    type="text"
    placeholder={'Name'}
    id={'polling_unit_name'}
    className="text-lg border-2 border-black px-4 py-3 leading-9 text-gray-900 focus:outline-none outline-none bg-transparent"
    name={'polling_unit_name'}
    onChange={props.handleChange}
    onBlur={props.handleBlur}
    value={formData.values['polling_unit_name']}
  />
  {formData.errors['polling_unit_name'] && formData.touched['polling_unit_name'] && (<p className="text-rose-600">{formData.errors['polling_unit_name']}</p>)}
  
</div>
<div className="mb-2 mt-2 ">
    <label htmlFor={'#polling_unit_number'} className="block">Polling Unit Number</label> 
<input
    type="text"
    placeholder={'Number'}
    id={'polling_unit_number'}
    className="text-lg border-2 border-black px-4 py-3 leading-9 text-gray-900 focus:outline-none outline-none bg-transparent"
    name={'polling_unit_number'}
    onChange={props.handleChange}
    onBlur={props.handleBlur}
    value={formData.values['polling_unit_number']}
  />
  {formData.errors['polling_unit_number'] && formData.touched['polling_unit_number'] && (<p className="text-rose-600">{formData.errors['polling_unit_number']}</p>)}
  
</div>


<div className="mb-2 mt-2 ">
    <label htmlFor={'#polling_unit_description'} className="block">Polling Unit Description</label> 
<textarea
    placeholder={'Description'}
    id={'polling_unit_description'}
    className="text-lg border-2 border-black px-4 py-3 leading-9 text-gray-900 focus:outline-none outline-none bg-transparent"
    name={'polling_unit_description'}
    onChange={props.handleChange}
    rows={5}
    onBlur={props.handleBlur}
    value={formData.values['polling_unit_description']}
  />
  {formData.errors['polling_unit_description'] && formData.touched['polling_unit_description'] && (<p className="text-rose-600">{formData.errors['polling_unit_description']}</p>)}
  
</div>
<div className="mb-2 mt-2 ">
    <label htmlFor={'#lat'} className="block">Polling Unit Latitude</label> 
<input
    type="text"
    placeholder={'Latitude'}
    id={'lat'}
    className="text-lg border-2 border-black px-4 py-3 leading-9 text-gray-900 focus:outline-none outline-none bg-transparent"
    name={'lat'}
    onChange={props.handleChange}
    onBlur={props.handleBlur}
    value={formData.values['lat']}
  />
  {formData.errors['lat'] && formData.touched['lat'] && (<p className="text-rose-600">{formData.errors['lat']}</p>)}
  
</div>

<div className="mb-2 mt-2 ">
    <label htmlFor={'#long'} className="block">Polling Unit Longitude</label> 
<input
    type="text"
    placeholder={'Longitude'}
    id={'long'}
    className="text-lg border-2 border-black px-4 py-3 leading-9 text-gray-900 focus:outline-none outline-none bg-transparent"
    name={'long'}
    onChange={props.handleChange}
    onBlur={props.handleBlur}
    value={formData.values['long']}
  />
  {formData.errors['long'] && formData.touched['long'] && (<p className="text-rose-600">{formData.errors['long']}</p>)}
  
</div>
    {['PDP', 'DPP', 'ACN', 'PPA', 'CDC', 'JP'].map((p, i) => (
  
<div className="mb-2 mt-2 " key={'party-' + i}>
    <label htmlFor={'#' + p} className="block"> Numbers for {p}</label> 
<input
    type="number"
    placeholder={p}
    id={p}
    className="text-lg border-2 border-black px-4 py-3 leading-9 text-gray-900 focus:outline-none outline-none bg-transparent"
    name={p}
    onChange={props.handleChange}
    onBlur={props.handleBlur}
    value={props.values[p]}
  />
  {props.errors[p] && props.touched[p] && (<p className="text-rose-600">{props.errors[p]}</p>)}
  
</div>
   

))}
     <Button disabled={isFetching || selectedLga < 0 || selectedWard < 0 || isLoading} onClick={formData.handleSubmit as any} type="submit">
             {isLoading ? 'Submitting' : 'Submit'}
           </Button>

</div>)}
}
</Formik>
         </div>

    </div>
  )
}

export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(`${SERVER_URL}/get-items/lga`)
    const data = await res.json();
    console.log(data.data.payload[0]);

    // Pass data to the page via props
    return { props: { data: data.data } }
}
export default WithSideBar(CreatePollingUnit, 'create_polling_unit')