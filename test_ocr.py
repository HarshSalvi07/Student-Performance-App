from src.data_loader import load_student_data

# Test with your file (change the filename)
file_path = "data/sample_student_data.csv"   # or your PDF/image path

df, text, file_type = load_student_data(file_path)

print(f"File Type: {file_type}")
print("\nExtracted Text:")
print(text[:800])   # first 800 characters