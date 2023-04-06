import pandas as pd

def generate_sql_statements(file_path, table_name):
    # Read the Excel file into a DataFrame
    df = pd.read_excel(file_path)

    # Iterate through each row of the DataFrame and build the SQL insert statement
    sql_statements = []
    for index, row in df.iterrows():
        values = ', '.join(['"' + str(value) + '"' for value in row])
        sql = f'INSERT INTO {table_name} VALUES ({values});'
        sql_statements.append(sql)

    return sql_statements

