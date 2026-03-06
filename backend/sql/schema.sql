CREATE DATABASE IF NOT EXISTS smart_expense_tracker;
USE smart_expense_tracker;

CREATE TABLE IF NOT EXISTS users (
  id          VARCHAR(36)  NOT NULL PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
  id          VARCHAR(36)    NOT NULL PRIMARY KEY,
  user_id     VARCHAR(36)    NOT NULL,
  title       VARCHAR(255)   NOT NULL,
  amount      DECIMAL(10, 2) NOT NULL,
  category    ENUM('Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Other') NOT NULL,
  date        DATE           NOT NULL,
  created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_user_date (user_id, date)
);

CREATE TABLE IF NOT EXISTS budgets (
  id              VARCHAR(36)    NOT NULL PRIMARY KEY,
  user_id         VARCHAR(36)    NOT NULL,
  monthly_budget  DECIMAL(10, 2) NOT NULL,
  month           TINYINT        NOT NULL,
  year            SMALLINT       NOT NULL,
  created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_month_year (user_id, month, year),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SHOW TABLES;