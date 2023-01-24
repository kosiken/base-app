import type { NextPage } from 'next'
import Head from 'next/head'
import Button from '../components/Button'
import SideBar from '../components/SidebarLayout';


const Dashboard: NextPage = () => {
    return (
        <SideBar active="dashboard">
            <div className="h-full">
                <Head>
                    <title>Create Next App</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main>
                    <p className="font-bold">Hello world</p>
                    <Button><span>Hello</span></Button>
                </main>


            </div>
        </SideBar>
    )
}

export default Dashboard;
