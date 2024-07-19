import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEllipsisVertical,
  faUsers,
  faChartLine,
  faDollarSign,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import {
  Card,
  CardBody,
  ProgressBar,
} from 'react-bootstrap'

import React from 'react'
import { getDictionary } from '@/locales/dictionary'

export default async function Page() {
  const dict = await getDictionary()

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
                      <FontAwesomeIcon icon={faChartLine} className="fs-4 me-2" />
                      <div className="fs-6 fw-bold">{dict.dashboard.sales.stats.stat1}</div>
                    </div>
                    <div className="fs-3 fw-bold">
                      10
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Second Statistic Card */}
            <div className="col-md-4 mb-4">
              <Card className="text-white bg-success rounded-3 shadow-sm">
                <CardBody>
                  <div className="d-flex flex-column h-100">
                    <div className="d-flex align-items-center mb-3">
                      <FontAwesomeIcon icon={faDollarSign} className="fs-4 me-2" />
                      <div className="fs-6 fw-bold">{dict.dashboard.sales.stats.stat2}</div>
                    </div>
                    <div className="fs-3 fw-bold">
                      22,643
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Third Statistic Card */}
            <div className="col-md-4 mb-4">
              <Card className="text-white bg-danger rounded-3 shadow-sm">
                <CardBody>
                  <div className="d-flex flex-column h-100">
                    <div className="d-flex align-items-center mb-3">
                      <FontAwesomeIcon icon={faTimesCircle} className="fs-4 me-2" />
                      <div className="fs-6 fw-bold">{dict.dashboard.sales.stats.stat3}</div>
                    </div>
                    <div className="fs-3 fw-bold">
                      78,623
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          <br />

          {/* Enhanced Data Display */}
          <div className="row">
            <div className="col-md-12">
              <div className="row g-3">
                {/* Displaying each item as a card */}
                <div className="col-md-12 mb-4">
                  <Card className="border-primary rounded-3 shadow-sm p-3">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="fw-bold">{dict.dashboard.listing.items.item1.name}</div>
                        <div className="text-muted small">{dict.dashboard.listing.usage_duration}</div>
                      </div>
                      <ProgressBar className="progress-thin" variant="warning" now={50} />
                      <div className="fs-5 fw-semibold mt-2">250</div>
                    </CardBody>
                  </Card>
                </div>
                {/* Add more cards here for additional items */}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
