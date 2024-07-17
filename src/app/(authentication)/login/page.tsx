import { Col, Row } from 'react-bootstrap'
import LoginForm from '@/app/(authentication)/login/login'
import { SearchParams } from '@/types/next'
import { getDictionary } from '@/locales/dictionary'
import Link from 'next/link'

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const { callbackUrl } = searchParams
  const dict = await getDictionary()

  const getCallbackUrl = () => {
    if (!callbackUrl) {
      return '/' // Default redirect to home page
    }

    return callbackUrl.toString()
  }

  return (
    
    <Row className="justify-content-center align-items-center px-2">
      <Col lg={8}>
        <Row >
          <Col className=" dark:bg-dark align-content-center text-left p-5 " 
          style={{
            backgroundColor: "rgb(81, 43, 129, 0.5)", 
            height: "600px", borderRadius: "12px", 
            boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset" 
            }}>
              
            <div style={{padding: "0 70px"}} >
              <img src="/assets/img/logo.png" alt="" style={{width: "50%", marginBottom: 40}} />
              <h1 style={{color: "white", marginBottom: 20}}>{dict.login.title}</h1>
              <p className="text-light-100 dark:text-gray-500" style={{color: "white"}} >{dict.login.description}</p>

              <LoginForm callbackUrl={getCallbackUrl()} />
            </div>
          </Col>
         
        </Row>
      </Col>
    </Row>
  )
}
