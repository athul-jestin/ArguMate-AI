-- ArguMate-AI Database Initialization
-- This file runs automatically when PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables

-- Debates table
CREATE TABLE IF NOT EXISTS debates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',
    created_by VARCHAR(255),
    round_count INTEGER DEFAULT 1
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
    agent VARCHAR(50) NOT NULL, -- 'Alpha' or 'Beta'
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'debate', -- 'debate', 'fact_check'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    round_number INTEGER DEFAULT 1
);

-- Fact checks table
CREATE TABLE IF NOT EXISTS fact_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
    agent VARCHAR(50) NOT NULL, -- 'Alpha' or 'Beta'
    claim TEXT NOT NULL,
    result VARCHAR(50), -- 'True', 'False', 'Partially True'
    source_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discussion points table
CREATE TABLE IF NOT EXISTS discussion_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
    point_text TEXT NOT NULL,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_debates_created_at ON debates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_debates_status ON debates(status);
CREATE INDEX IF NOT EXISTS idx_messages_debate_id ON messages(debate_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fact_checks_debate_id ON fact_checks(debate_id);
CREATE INDEX IF NOT EXISTS idx_fact_checks_message_id ON fact_checks(message_id);
CREATE INDEX IF NOT EXISTS idx_discussion_points_debate_id ON discussion_points(debate_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for debates table
CREATE TRIGGER update_debates_updated_at
    BEFORE UPDATE ON debates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to application user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO argumate_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO argumate_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO argumate_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO argumate_user;
