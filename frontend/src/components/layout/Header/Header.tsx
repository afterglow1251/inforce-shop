import { Link } from "react-router";
import { Layout, Typography } from "antd";
import styles from "./Header.module.css";
import { ROUTES } from "../../../constants/routes";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header = () => {
  return (
    <AntHeader className={styles.header}>
      <div className={styles.container}>
        <Link to={ROUTES.HOME} className={styles.link}>
          <Title level={3} className={styles.title}>
            Product Manager
          </Title>
        </Link>
      </div>
    </AntHeader>
  );
};
