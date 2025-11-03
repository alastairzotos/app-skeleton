import { urls } from "@repo/common"
import { Button, Result } from "antd"
import React from "react"
import { Link } from "react-router-dom"

export const NoMatchPage: React.FC = () => {
  return (
    <Result
      status="404"
      title="Cannot find this page"
      extra={(
        <Link to={urls.home()}>
          <Button color="default" variant="solid" size="large">
            Return Home
          </Button>
        </Link>
      )}
    />
  )
}
