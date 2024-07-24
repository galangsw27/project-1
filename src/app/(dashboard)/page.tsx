import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faRedoAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  CardBody,
  ProgressBar,
} from 'react-bootstrap';
import { getDictionary } from '@/locales/dictionary';
import { blastStat, checkSession, resendtStat } from '@/utils/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/option';

export default async function Page() {
  const dict = await getDictionary();
  const session: any = await getServerSession(authOptions);
  const token = session?.user?.authToken;

  const getAllSession: any = await checkSession(token);
  const sessionNames = getAllSession ? getAllSession.data.map((session: any) => session.session_name) : [];
  const countSession = sessionNames.length;

  let totalSuccessCount = 0;
  let totalFailureCount = 0;
  let totalResendCount = 0;
  let totalFailureResendCount = 0;

  if (countSession > 0) {
    const resendData: any = await resendtStat(token, sessionNames);
    const blastData: any = await blastStat(token, sessionNames);

    totalSuccessCount = blastData?.data.reduce((acc: any, item: any) => acc + (item.success_count || 0), 0);
    totalFailureCount = blastData?.data.reduce((acc: any, item: any) => acc + (item.failure_count || 0), 0);
    totalResendCount = resendData?.data.reduce((acc: any, item: any) => acc + (item.resend_count || 0), 0);
    totalFailureResendCount = resendData?.data.reduce((acc: any, item: any) => acc + (item.failure_resend_count || 0), 0);
  }

  // Function to chunk the session data
  const chunkSessions = (sessions: any, chunkSize: any) => {
    const chunks = [];
    for (let i = 0; i < sessions.length; i += chunkSize) {
      chunks.push(sessions.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const sessionChunks = chunkSessions(sessionNames, countSession);

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            {/* First Statistic Card */}
            <div className="col-md-4 mb-4">
              <Card className="text-white bg-info rounded-3 shadow-sm">
                <CardBody>
                  <div className="d-flex flex-column h-100">
                    <div className="d-flex align-items-center mb-3">
                      <FontAwesomeIcon icon={faCalendarCheck} className="fs-4 me-2" />
                      <div className="fs-6 fw-bold">{dict.dashboard.sales.stats.stat1}</div>
                    </div>
                    <div className="fs-3 fw-bold">
                      {countSession}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            {/* Additional Statistic Cards */}
            <div className="row">
              <div className="col-md-3 mb-4">
                <Card className="text-white bg-success rounded-3 shadow-sm">
                  <CardBody>
                    <div className="d-flex flex-column h-100">
                      <div className="d-flex align-items-center mb-3">
                        <FontAwesomeIcon icon={faCheckCircle} className="fs-4 me-2" />
                        <div className="fs-6 fw-bold">{dict.dashboard.sales.stats.stat2}</div>
                      </div>
                      <div className="fs-3 fw-bold">
                        {totalSuccessCount}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="col-md-3 mb-4">
                <Card className="text-white bg-danger rounded-3 shadow-sm">
                  <CardBody>
                    <div className="d-flex flex-column h-100">
                      <div className="d-flex align-items-center mb-3">
                        <FontAwesomeIcon icon={faExclamationCircle} className="fs-4 me-2" />
                        <div className="fs-6 fw-bold">{dict.dashboard.sales.stats.stat3}</div>
                      </div>
                      <div className="fs-3 fw-bold">
                        {totalFailureCount}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="col-md-3 mb-4">
                <Card className="text-white bg-success2 rounded-3 shadow-sm">
                  <CardBody>
                    <div className="d-flex flex-column h-100">
                      <div className="d-flex align-items-center mb-3">
                        <FontAwesomeIcon icon={faRedoAlt} className="fs-4 me-2" />
                        <div className="fs-6 fw-bold">{dict.dashboard.sales.stats.stat4}</div>
                      </div>
                      <div className="fs-3 fw-bold">
                        {totalResendCount}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="col-md-3 mb-4">
                <Card className="text-white bg-warning2 rounded-3 shadow-sm">
                  <CardBody>
                    <div className="d-flex flex-column h-100">
                      <div className="d-flex align-items-center mb-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="fs-4 me-2" />
                        <div className="fs-6 fw-bold">{dict.dashboard.sales.stats.stat5}</div>
                      </div>
                      <div className="fs-3 fw-bold">
                        {totalFailureResendCount}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
          <br />
          {/* Enhanced Data Display */}
          {sessionChunks.map((chunk, index) => (
            <div className="row g-3 mb-4" key={index}>
              {chunk.map((sessionName: any, idx: any) => (
                <div className="col-md-6" key={idx}>
                  <Card className="border-primary rounded-3 shadow-sm p-3">
                    <CardBody>
                      <div className="d-flex align-items-center mb-2">
                        <div style={{ paddingRight: 5, color: 'brown', fontWeight: 500 }}>Session Name:</div>
                        <div className="fw-bold">{sessionName}</div>
                        <div className="ms-auto text-muted medium">{dict.dashboard.listing.usage_duration}</div>
                      </div>
                      <ProgressBar className="progress-thin" variant="warning" now={totalResendCount} />
                      <div className="fs-5 fw-semibold mt-2">
                        {totalResendCount}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
