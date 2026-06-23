from flask import Flask, render_template, request
import pickle
import numpy as np

app = Flask(__name__)

# --- keep your existing model loading exactly as-is ---
with open("model.pkl", "rb") as f:
    model = pickle.load(f)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict")
def predict():
    return render_template("predict.html")


@app.route("/result", methods=["POST"])
def result():
    # --- keep your existing feature extraction / encoding exactly as-is ---
    age = float(request.form.get("age", 0))
    gender = request.form.get("gender", "")
    gender = request.form['gender']

    if gender.lower() == 'male':
        gender = 1
    else:
        gender = 0
    bmi = float(request.form.get("bmi", 0))
    previous_appointments = float(request.form.get("previous_appointments", 0))
    missed_previous_appointments = float(request.form.get("missed_previous_appointments", 0))
    booking_to_appointment_days = float(request.form.get("booking_to_appointment_days", 0))
    waiting_time_minutes = float(request.form.get("waiting_time_minutes", 0))

    # NOTE: replace this feature vector with the exact column order
    # your model.pkl was trained on.
    features = [[
    age,                              # age
    gender,                           # gender
    0,                                # city
    bmi,                              # bmi
    0,                                # chronic_disease
    0,                                # appointment_type
    0,                                # department
    0,                                # symptoms
    0,                                # severity_level
    10,                               # doctor_experience_years
    500,                              # consultation_fee
    0,                                # insurance
    1,                                # appointment_day
    1,                                # appointment_month
    booking_to_appointment_days,     # booking_to_appointment_days
    waiting_time_minutes,             # waiting_time_minutes
    previous_appointments,            # previous_appointments
    missed_previous_appointments,     # missed_previous_appointments
    4,                                # hospital_rating
    0,                                # emergency_case
    8,                                # patient_satisfaction_score
    500,                              # medicine_cost
    1000,                             # test_cost
    1500                              # total_bill
]]
    
    raw_prediction = model.predict(features)[0]  # however your model encodes the label

    # Map your model's raw output to one of: "show", "risk", "miss"
    # Example for a binary classifier where 1 = no-show, 0 = show:
    if raw_prediction == 1:
        prediction = "miss"
    else:
        prediction = "show"

    # Optional: if your model supports predict_proba, use it for a real confidence score
    confidence = 74
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(features)[0]
        confidence = int(round(max(proba) * 100))

    risk_factors = [
        {
            "label": "Missed previous appointments",
            "detail": f"{int(missed_previous_appointments)} missed visit(s) on record.",
            "positive": missed_previous_appointments == 0,
        },
        {
            "label": "Booking lead time",
            "detail": f"Booked {int(booking_to_appointment_days)} day(s) in advance.",
            "positive": booking_to_appointment_days <= 7,
        },
        {
            "label": "Typical waiting time",
            "detail": f"Historically waits about {int(waiting_time_minutes)} minute(s).",
            "positive": waiting_time_minutes <= 20,
        },
    ]

    return render_template(
        "result.html",
        prediction=prediction,
        confidence=confidence,
        risk_factors=risk_factors,
    )


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == "__main__":
    app.run(debug=True)