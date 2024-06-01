import pandas as pd
import psycopg2
from psycopg2 import sql

# Replace these values with your PostgreSQL connection details
dbname = "port"
user = "postgres"
password = "1435"
host = "localhost"
port = "5432"

# Excel file path and table name
excel_file_path = "C://Users//Lenovo//Downloads//__PORT_2024__Registration_Data_.csv"
table_name = "participant_data"

# Establishing a connection to the PostgreSQL database
conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)
cursor = conn.cursor()

# Read Excel data into a DataFrame
df = pd.read_csv(excel_file_path)

# Create the table if it does not exist
columns = [sql.Identifier(col) for col in df.columns]


# Insert data into the table
insert_query = sql.SQL("INSERT INTO {} ({}) VALUES ({})").format(
    sql.Identifier(table_name),
    sql.SQL(', ').join(columns),
    sql.SQL(', ').join([sql.Placeholder()]*len(df.columns))
)

for index, row in df.iterrows():
    cursor.execute(insert_query, tuple(row))

# Commit changes and close the connection
conn.commit()
cursor.close()
conn.close()

print("Excel data inserted into PostgreSQL database successfully.")
