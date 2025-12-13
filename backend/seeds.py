from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

db = SessionLocal()

def seed_data():
    # Mock Lawyers
    lawyers = [
        models.Lawyer(
            id='1',
            name='Sarah Johnson',
            email='sarah.johnson@email.com',
            role='lawyer',
            status='active',
            specialization=['Criminal Law', 'Family Law'],
            experience=8,
            rating=4.8,
            casesHandled=156,
            availability='online',
            verified=True,
            createdAt='2024-01-15',
            documents=[
                {'id': '1', 'name': 'Bar Certificate.pdf', 'type': 'PDF', 'uploadedAt': '2024-01-15', 'size': '2.5 MB'}
            ]
        ),
        models.Lawyer(
            id='2',
            name='Michael Chen',
            email='michael.chen@email.com',
            role='lawyer',
            status='active',
            specialization=['Corporate Law', 'IP Law'],
            experience=12,
            rating=4.9,
            casesHandled=203,
            availability='busy',
            verified=True,
            createdAt='2023-11-20',
            documents=[]
        ),
        models.Lawyer(
            id='3',
            name='Emily Rodriguez',
            email='emily.rodriguez@email.com',
            role='lawyer',
            status='pending',
            specialization=['Immigration Law'],
            experience=5,
            rating=4.6,
            casesHandled=89,
            availability='offline',
            verified=False,
            createdAt='2024-12-01',
            documents=[]
        )
    ]
    
    # Mock Clients
    clients = [
        models.Client(
            id='1',
            name='John Smith',
            email='john.smith@email.com',
            role='client',
            status='active',
            consultations=3,
            booksDownloaded=2,
            articlesRead=15,
            totalSpent=850,
            createdAt='2024-02-10'
        ),
        models.Client(
            id='2',
            name='Lisa Wang',
            email='lisa.wang@email.com',
            role='client',
            status='active',
            consultations=1,
            booksDownloaded=5,
            articlesRead=23,
            totalSpent=320,
            createdAt='2024-03-05'
        ),
        models.Client(
            id='3',
            name='David Brown',
            email='david.brown@email.com',
            role='client',
            status='inactive',
            consultations=0,
            booksDownloaded=1,
            articlesRead=7,
            totalSpent=45,
            createdAt='2024-01-28'
        )
    ]

    # Mock Cases
    cases = [
        models.Case(
            id='1',
            title='Personal Injury Claim',
            clientId='1',
            lawyerId='1',
            status='in-progress',
            stage='Discovery',
            priority='high',
            createdAt='2024-11-15',
            nextHearing='2024-12-20',
            documents=[
                {'id': '1', 'name': 'Medical Records.pdf', 'type': 'PDF', 'uploadedAt': '2024-11-16', 'size': '5.2 MB'},
                {'id': '2', 'name': 'Incident Report.docx', 'type': 'DOCX', 'uploadedAt': '2024-11-17', 'size': '1.8 MB'}
            ]
        ),
        models.Case(
            id='2',
            title='Contract Dispute',
            clientId='2',
            lawyerId='2',
            status='open',
            stage='Initial Review',
            priority='medium',
            createdAt='2024-12-01',
            documents=[]
        ),
        models.Case(
            id='3',
            title='Immigration Appeal',
            clientId='3',
            lawyerId='3',
            status='closed',
            stage='Completed',
            priority='low',
            createdAt='2024-10-05',
            documents=[]
        )
    ]

    # Mock Appointments
    appointments = [
        models.Appointment(
            id='1',
            clientName='John Smith',
            lawyerName='Sarah Johnson',
            date='2024-12-18',
            time='14:00',
            type='consultation',
            status='pending',
            notes='Initial consultation for personal injury case'
        ),
        models.Appointment(
            id='2',
            clientName='Lisa Wang',
            lawyerName='Michael Chen',
            date='2024-12-19',
            time='10:30',
            type='hearing',
            status='approved'
        ),
        models.Appointment(
            id='3',
            clientName='David Brown',
            lawyerName='Emily Rodriguez',
            date='2024-12-17',
            time='16:00',
            type='meeting',
            status='completed'
        )
    ]
    
    # Clear existing data?
    # db.query(models.Lawyer).delete()
    # db.query(models.Client).delete()
    # db.query(models.Case).delete()
    # db.query(models.Appointment).delete()

    # Add new data
    for lawyer in lawyers:
        db.merge(lawyer) # merge allows upsert if id exists
    for client in clients:
        db.merge(client)
    for case in cases:
        db.merge(case)
    for appointment in appointments:
        db.merge(appointment)
        
    db.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    seed_data()
